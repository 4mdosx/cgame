import { getContext } from "@/game/utils"

function ResourceButton (props) {
  const { name } = props
  return (
    <div>
      {name}
    </div>
  )
}

function getResources () {
  const resources = {}
  const blocks = new Set()
  const { character, world } = getContext().modules
  character.characters.forEach((character) => {
    const block = world.map[character.position.join(',')]
    if (block && block.resources) blocks.add(block)
  })
  for (const block of blocks) {
    for (const resource in block.resources) {
      if (!resources[resource]) resources[resource] = 0
      resources[resource]+= block.resources[resource]
    }
  }

  return Object.entries(resources)
}

export default function Resources () {
  const resources = getResources()

  return (
    <div className='resources'>
      {
        resources.map(resource => {
          return (
            <ResourceButton key={resource[0]} name={resource[0]} />
          )
        })
      }
    </div>
  )
}

