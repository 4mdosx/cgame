import { useStore } from '@/store/main.js'

const Titles = [
  'Items'
]

function Header () {
  return (
    <div className="header flex justify-between w-full">
      <h1>{Titles[0]}</h1>
      <span> 0 / 10</span>
    </div>
  )
}
export default function Storage () {
  const bears = useStore((state) => state.bears)

  return (
    <div className="storage">
      <Header />
      <div className="test flex justify-between">
        bears: {bears}
      </div>
    </div>
  )
}
