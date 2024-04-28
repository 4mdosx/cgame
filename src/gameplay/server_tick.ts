import prisma from '@/lib/prisma'
import { BuildOrder, Ark } from '../../type/typing'
import * as GameArk from '@/gameplay/ark'
import * as calculator from './calculator'
import initArk from './class/ark'

export async function orderUpdate() {
  const orders = (await prisma.buildOrder.findMany({
    where: {
      status: 'processing',
      finishedAt: {
        lte: new Date(),
      },
    },
  })) as unknown as BuildOrder[]
  orders.forEach(async (order) => {
    const ark = (await prisma.ark.findFirst({
      where: {
        id: order.arkId,
      },
      include: {
        accessPort: true,
      },
    })) as unknown as Ark
    if (order.payload && ark.position === order.payload.position) {
      // 更新订单状态
      await prisma.buildOrder.update({
        where: {
          id: order.id,
        },
        data: {
          status: 'finished',
        },
      })
      // 更新资源
      const fac = ark.accessPort.facilities.find(
        (f) => f.id === order.buildName
      )
      if (fac) {
        fac.level++
      } else {
        ark.accessPort.facilities.push({
          id: order.buildName,
          level: 1,
        })
      }
      await prisma.accessPort.update({
        where: {
          id: ark.accessPort.id,
        },
        data: {
          facilities: ark.accessPort.facilities as any,
        },
      })
    }
  })

  const pendingOrderArks = (await prisma.buildOrder.groupBy({
    by: ['arkId'],
    where: {
      status: 'pending',
    },
  })) as unknown as any[]
  await Promise.all(
    pendingOrderArks.map(async (ark) => {
      const processingOrder = await prisma.buildOrder.findFirst({
        where: {
          arkId: ark.arkId,
          status: 'processing',
        },
      })
      if (!processingOrder) await GameArk.startPending(ark.arkId)
    })
  )
}

export async function progressUpdate(type) {
  const orders = (await prisma.order.findMany({
    where: {
      type,
      status: {
        in: ['processing', 'pending'],
      },
    },
  })) as unknown as any[]
  const arkIdSets = new Set()
  orders.forEach((order) => {
    arkIdSets.add(order.arkId)
  })
  const arkIdSetsArray = Array.from(arkIdSets)
  return Promise.all(
    arkIdSetsArray.map(async (arkId) => {
      const ark = await initArk(arkId)
      return ark.updateOrders(type)
    })
  )
}

export async function incomeUpdate() {
  const ghosts = await prisma.ghost.findMany({
    include: {
      arks: {
        include: {
          accessPort: true,
        },
      },
    },
  })
  ghosts.forEach(async (ghost) => {
    const arks = ghost.arks as unknown as Ark[]

    const income = arks.reduce((acc, ark) => {
      if (!ark.accessPort) return acc
      const acAttrs = calculator.accessPortAttrs(ark.accessPort)
      return acc + acAttrs.economy
    }, 0)
    await prisma.ghost.update({
      where: {
        id: ghost.id,
      },
      data: {
        credit: {
          increment: income,
        },
      },
    })
  })
}
