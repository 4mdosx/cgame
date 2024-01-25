import { getContext, dispatch, getGameStatus } from '../interface'

function consume_fuel (building) {
  if (!building.data.fuel) {
    building.data.fuel = {
      count: 10,
      max: 50,
    }
    if (building.data.name === 'bonfire' && building.data.hope_count === undefined) {
      building.data.hope_count = 4
    }
  }

  building.add_fuel = () => {
    if (building.data.fuel.count < building.data.fuel.max) {
      const { modules: { inventory } } = getContext()
      const candidates = inventory.match('fuel')
      const item = candidates.sort((a, b) => a[1].fuel - b[1].fuel)[0]
      if (!item) return
      const result = inventory.consume(item[0], 1)
      if (result) {
        building.data.fuel.count += item[1].fuel
        if (building.data.fuel.count > building.data.fuel.max) building.data.fuel.count = building.data.fuel.max
        dispatch({ type: 'system/sync' })
      }
    }
  }

  building.runners.push(() => {
    if (building.data.fuel.count > 0) {
      building.data.fuel.count--
      const territorial_radius = getGameStatus('territorial_radius')
      if (territorial_radius > 1000) return
      if (territorial_radius % 100 === 0 || territorial_radius === 30) {
        if (building.data.hope_count > 0) {
          let name = ''
          if (building.data.hope_count === 4) name = 'stick'
          if (building.data.hope_count === 3) name = 'stone'
          if (building.data.hope_count === 2) name = 'wood'
          if (building.data.hope_count === 1) name = 'ora'

          dispatch({ type: 'world/home_expend', name })
          building.data.hope_count--
        } else {
          dispatch({ type: 'world/survey', position: [0, 0] })
        }
      }
      dispatch({ type: 'store/update', name: 'territorial_radius', val: 1 })
    } else {
      dispatch({ type: 'system/sync' })
    }
  })
}

export const decorators = {
  consume_fuel
}
