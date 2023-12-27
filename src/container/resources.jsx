import { getContext } from "@/game/utils"

function ResourceButton (props) {
  const { name } = props

  return (
    <div onClick={() => props.onGathering(name)}>
      {name}
    </div>
  )
}

function Resources (props) {
  const { position, block } = props
  function gathering (name) {
    getContext().dispatch({
      type: 'character/gathering',
      position,
      itemName: name,
      quantity: 1,
      character: getContext().modules.character.me
    })
  }

  return (
    <div>
      {
        Object.entries(block.resources).map(resource => {
          return (
            <ResourceButton
              key={resource[0]}
              name={resource[0]}
              onGathering={gathering}
            />
          )
        })
      }
    </div>
  )
}

export default function blockResources () {
  const { world } = getContext().modules
  const blocks = world.blockResources

  return (
    <div className='resources'>
      {
        blocks.map(block => {
          return (
            <div key={block[0]}>
              <div>{block[0]}</div>
              <Resources position={block[0]} block={block[1]} />
            </div>
          )
        })
      }
    </div>
  )
}

