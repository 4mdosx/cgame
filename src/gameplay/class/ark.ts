import prisma from '@/lib/prisma'
import { Ark, ArkAttrs, BuildUnitOrder } from '../../../type/typing'
import unitMod from '../mod/unit'
import { arkAttrs } from '../calculator'
import CONSTANT from '../constant'

export class ArkUtils {
  ark: Ark
  attrs: ArkAttrs

  constructor(ark) {
    this.ark = ark
    this.attrs = arkAttrs(ark)
  }

  private async checkQueueFull(type) {
    const pendingOrders = await prisma.order.findMany({
      where: {
        ghostId: this.ark.ghostId,
        status: 'pending',
      },
    })
    if (type.includes('build_')) {
      const queue = pendingOrders.filter((order) => order.type === type)
      const queueName = type.replace('build_', '') + '_queue'
      if (queue.length >= this.attrs[queueName]) {
        throw new Error(queueName + ' full')
      }
    }
  }

  async buildUnit({ unitId, unitCount }) {
    await this.checkQueueFull('build_unit')
    const unitSpec = unitMod[unitId]
    const cost = unitSpec.cost * unitCount
    const progressMax = cost * CONSTANT.tickPerTurn
    await prisma.order.create({
      data: {
        ghostId: this.ark.ghostId,
        type: 'build_unit',
        status: 'pending',
        cost,
        progress: 0,
        progressMax,
        payload: {
          unitId,
          unitCount,
          arkId: this.ark.id,
        },
      },
    })
    await this.updateOrders('build_unit')
  }

  async updateOrders (type) {
    const pendingOrders = await prisma.order.findMany({
      where: {
        ghostId: this.ark.ghostId,
        type,
        status: {
          in: ['pending', 'processing'],
        }
      },
      orderBy: {
        createdAt: 'asc',
      }
    })
    if (pendingOrders.length === 0) return

    let order = pendingOrders[0]
    if (pendingOrders[0].status === 'processing') {
      const progress = type === 'build_unit' ? this.attrs.industrial : this.attrs.build
      const finished = order.progress + progress >= order.progressMax
      await prisma.order.update({
        where: {
          id: order.id
        },
        data: {
          progress: {
            increment: progress
          },
          status: finished ? 'finished' : 'processing'
        }
      })

      if (finished) {
        switch (type) {
          case 'build_unit':
            const { arkId, unitCount, unitId } = (order as unknown as BuildUnitOrder).payload
            const ark = await prisma.ark.findFirst({ where: { id: arkId } }) as unknown as Ark
            await prisma.ark.update({
              where: {
                id: arkId
              },
              data: {
                apron: {
                  ...ark.apron,
                  [unitId]: (ark.apron[unitId] || 0) + unitCount
                }
              }
            })
            break
          case 'build_facility':
            // TDOO: implement
            break
        }
        order = pendingOrders[1]
        if (!order) return
      }
    }

    // TODO: check if the ark has enough credit
    await prisma.$transaction([
      prisma.order.update({
        where: {
          id: order.id
        },
        data: {
          status: 'processing',
        }
      }),
      prisma.ghost.update({
        where: {
          id: this.ark.ghostId
        },
        data: {
          credit: {
            decrement: order.cost
          }
        }
      })
    ])
  }
}

export default async function initArk(arkId, where = {}) {
  const ark = await prisma.ark.findFirst({
    where: {
      id: arkId,
      ...where,
    },
    include: {
      accessPort: true,
    }
  })
  if (!ark) throw new Error('ark not found')
  return new ArkUtils(ark)
}
