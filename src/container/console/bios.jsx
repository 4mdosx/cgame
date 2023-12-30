import React, { useState } from 'react'

export default function BIOS () {
  const [focus, setFocus] = useState(false)

  return (
    <div className='bios'>
      <div
        className={`screen ${focus ? 'focus' : ''}`}
        onMouseEnter={() => setFocus(true)}
        onMouseLeave={() => setFocus(false)}
      >
        <p>Cyberian <span>B</span>asic <span>I</span>nput/<span>O</span>utput <span>S</span>ystem</p>
      </div>
    </div>
  )
}