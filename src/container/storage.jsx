
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
  return (
    <div className="storage">
      <Header />
      <div className="test flex justify-between"></div>
    </div>
  )
}