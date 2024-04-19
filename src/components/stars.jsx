import { useEffect } from 'react'
import './stars.css'

export default function Stars() {
  useEffect(() => {
    const start_count = 200
    const r = 600
    let starts = ''
    for (let i = 0; i < start_count; i++) {
      var s = 0.2 + Math.random() * 1
      var curR = r + Math.random() * 300
      const css = `transform-origin: 0 0 ${curR}px; transform: translate3d(0,0,-${curR}px) rotateY(${
        Math.random() * 360
      }deg) rotateX(${Math.random() * -50}deg) scale(${s},${s});`
      starts += `<div class="star" style="${css}"></div>`
    }
    document.querySelector('.stars').innerHTML = starts
  }, [])
  return (
    <div className="stars-box">
      <div className="stars"></div>
    </div>
  )
}
