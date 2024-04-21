import { Ark } from '../../type/typing'
import prisma from '@/lib/prisma'
import facility from './mod/facilities'
import * as calculator from './calculator'

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

  // validate build queue
  if (ark.buildOrders.length >= ark.attributes.build_queue) {
    throw new Error('build queue full')
  }

  // validate credit
  const fac = ark.accessPort.facilities.find(f => f.id === buildName) || { id: buildName, level: 0 }
  if (!facility.ap[buildName]) {
    throw new Error('facility not found')
  }

  const cost = (fac.level + 1) ** 1.5 * facility.ap[buildName].cost
  if (ark.ghost.credit < cost) {
    throw new Error('credit not enough')
  }


  const build = calculator.buildPoint({ ark, accessPort: ark.accessPort })

  await prisma.$transaction([
    prisma.buildOrder.create({
      data: {
        arkId: ark.id,
        buildName: buildName,
        status: 'processing',
        payload: {
          position: ark.position,
        },
        finishedAt: calculator.buildFinishedAt({ cost, buildPoint: build })
      }
    }),
    prisma.ghost.update({
      where: {
        id: ark.ghost.id
      },
      data: {
        credit: {
          decrement: cost
        }
      }
    })
  ])
}
