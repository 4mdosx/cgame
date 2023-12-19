export default function Button(props) {
  return (
    <button className="border p-2 border-black">
      {props.children}
    </button>
  )
}
