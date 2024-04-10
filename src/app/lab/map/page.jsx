'use client'
import React from 'react'
import Map from '@/world/index.tsx'

export default function MapLabPage() {
  return (
    <main style={{ backgroundColor: '#444d56', height: '100vh', width: '100vw'}}>
      <section className='container flex align-middle justify-center w-full m-auto'>
        <Map></Map>
      </section>
      <footer>
        <button onClick={() => window.world.clear()}></button>
      </footer>
    </main>
  )
}
