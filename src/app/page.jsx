'use client'
import Nav from '@/container/nav.jsx'
import State from '@/container/state.jsx'
import Storage from '@/container/storage.jsx'
import Game from '@/game/core/main.js'
import React from 'react'
import { useStore } from '@/store/main'

export default function Home() {
  const [state, setState] = React.useState({})
  const render = useStore(state => state.mapGameStatusToStore)
  if (!state.inited) {
    window.addEventListener('load', () => {
      globalThis.game = new Game({ render })
      const gameSave = JSON.parse(localStorage.getItem('the-sunken-ancient-world')) || {}
      globalThis.game.init(gameSave)
      setState({ inited: true })
    })
  }

  function save () {
    localStorage.setItem('the-sunken-ancient-world', JSON.stringify(globalThis.game.valueOf()))
  }
  function reset () {
    localStorage.removeItem('the-sunken-ancient-world')
    window.location.reload()
  }
  if (!state.inited) return <p>loading...</p>

  return (
    <main className="overview_page grid grid-cols-12 gap-4">
      <div className="col-span-3 nav_wrapper">
        <Nav></Nav>
      </div>
      <div className="col-span-6 env_wrapper">
        <div className="flex gap-2 flex-col h-full">
          <div className="basis-2/3">
            <State></State>
          </div>
        </div>
      </div>
      <div className="col-span-3 monitor_wrapper">
        <div className="grid grid-rows-2 gap-2 h-full">
          {/* <Logs></Logs> */}
          <Storage></Storage>
        </div>
      </div>
      <footer className='fixed right-0 bottom-0'>
        <button onClick={save} className='mr-2'>save</button>
        <button onClick={reset}>reset</button>
      </footer>
    </main>
  )
}
