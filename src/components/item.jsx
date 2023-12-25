import { useStore } from '@/game/core/main'

export default function BonfireButton() {
  const bonfire = useStore((state) => state['building/bonfire'])

  return (
    <div className="button_group">
      <button>
        {bonfire.name}
      </button>
      <button>添柴</button>
    </div>
  )
}
