import { useStore } from '@/store/main'

export default function Overview () {
  const overview = useStore(state => state.overview)
  return (
    <div>
      {JSON.stringify(overview)}
    </div>
  )
}
