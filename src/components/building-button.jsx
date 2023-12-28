import { buildings } from '@/game/schema/building'
import { getContext } from '@/game/utils'

function FuelIndicator ({ building }) {
  const width = building.fuel.count / building.fuel.max * 100
  return (
    <div className='fuel-indicator' style={{ width: width + '%' }}></div>
  )
}

export default function BuildingButton({ building }) {
  const schema = buildings[building.name]
  const onEvent = (event) => {
    getContext().dispatch({ type: 'building/event', name: building.name, event })
  }

  return (
    <div className='button building'>
      <span className='name'>{schema.name}</span>
      {schema.menu.map((menu) => {
        return (
          <div
            className='menu'
            key={menu.name}
            onClick={() => {
              onEvent(menu.event)
            }}
          >
            {menu.name}
          </div>
        )
      })}
      {
        building.fuel ? <FuelIndicator building={building}></FuelIndicator> : null
      }
    </div>
  )
}
