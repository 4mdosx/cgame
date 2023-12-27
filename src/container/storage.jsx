import { useStore } from '@/store/main.js'
import { getGameStatus } from '@/game/utils/index.js'

export default function Storage () {
  const items = useStore((state) => state.items)
  const itemsKeys = Object.keys(items)
  if (itemsKeys.length === 0) return null
  return (
    <div className="storage">
      <h1>Items</h1>
      <div className="flex justify-between">
        {
          itemsKeys.map((key) => {
            return (
              <div key={key} className="w-full flex justify-between">
                <span>{key}</span>
                <span>{items[key]}/{ getGameStatus('MAX_STORAGE/' + key) }</span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
