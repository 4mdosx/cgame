import { Ark } from '../../type/typing'
import prisma from '@/lib/prisma'
import * as calculator from './calculator'
import facility from './mod/facilities'

function buildValidate (ark: Ark, buildName: string) {
  const cost = calculator.buildCost({ accessPort: ark.accessPort, buildName })
  if (ark.ghost.credit < cost) {
    throw new Error('credit not enough')
  }
  const schema = facility.ap[buildName]
  const attrs = calculator.accessPortAttrs(ark.accessPort)
  schema.effect.forEach(eff => {
    if (eff.type.includes('_used')) {
      const key = eff.type.split('_')[0]
      if (attrs[key + '_used'] + eff.value > attrs[key]) {
        throw new Error(key + ' not enough')
      }
    }
  })

  return true
}

export async function build (arkId: number, buildName: string) {
  const ark = await prisma.ark.findFirst({
    where: {
      id: arkId
    },
    include: {
      ghost: true,
      accessPort: true,
      buildOrders: {
        where: {
          status: 'processing'
        }
      }
    }
  }) as unknown as Ark

  if (!ark) {
    throw new Error('ark not found')
  }

  if (ark.buildOrders.length) {
    const pendingOrders = await prisma.buildOrder.findMany({
      where: {
        arkId: ark.id,
        status: 'pending'
      }
    })
    if (pendingOrders.length >= ark.attributes.build_queue) {
      throw new Error('build queue full')
    } else {
      await prisma.buildOrder.create({
        data: {
          arkId: ark.id,
          buildName: buildName,
          status: 'pending',
          finishedAt: calculator.buildFinishedAt({ cost: calculator.buildCost({ accessPort: ark.accessPort, buildName }), buildPoint: calculator.buildPoint({ accessPort: ark.accessPort }) + ark.attributes.build }),
          payload: {
            position: ark.position,
          }
        }
      })
      return
    }
  }

  // validate
  buildValidate(ark, buildName)

  await prisma.$transaction([
    prisma.buildOrder.create({
      data: {
        arkId: ark.id,
        buildName: buildName,
        status: 'processing',
        payload: {
          position: ark.position,
        },
        finishedAt: calculator.buildFinishedAt({ cost: calculator.buildCost({ accessPort: ark.accessPort, buildName }), buildPoint: calculator.buildPoint({ accessPort: ark.accessPort }) + ark.attributes.build })
      }
    }),
    prisma.ghost.update({
      where: {
        id: ark.ghost.id
      },
      data: {
        credit: {
          decrement: calculator.buildCost({ accessPort: ark.accessPort, buildName })
        }
      }
    })
  ])
}

export async function startPending (arkId: number) {
  const ark = await prisma.ark.findFirst({
    where: {
      id: arkId
    },
    include: {
      ghost: true,
      accessPort: true,
      buildOrders: {
        where: {
          status: 'pending'
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  }) as unknown as Ark

  if (ark.buildOrders.length) {
    const order = ark.buildOrders[0]
    buildValidate(ark, order.buildName)

    await prisma.$transaction([
      prisma.buildOrder.update({
        where: {
          id: order.id
        },
        data: {
          status: 'processing',
          finishedAt: calculator.buildFinishedAt({ cost: calculator.buildCost({ accessPort: ark.accessPort, buildName: order.buildName }), buildPoint: calculator.buildPoint({ accessPort: ark.accessPort }) + ark.attributes.build })
        }
      }),
      prisma.ghost.update({
        where: {
          id: ark.ghost.id
        },
        data: {
          credit: {
            decrement: calculator.buildCost({ accessPort: ark.accessPort, buildName: order.buildName })
          }
        }
      })
    ])
  }
}
