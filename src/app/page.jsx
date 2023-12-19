'use client'
import Nav from '@/container/nav.jsx'
import Foundation from '@/container/foundation.jsx'
import Console from '@/container/console.jsx'
import Logs from '@/container/logs.jsx'
import Storage from '@/container/storage.jsx'

export default function Home() {
  return (
    <main className="overview_page grid grid-cols-12 gap-4">
      <div className="col-span-3 nav_wrapper">
        <Nav></Nav>
      </div>
      <div className="col-span-6 env_wrapper">
        <div className="flex gap-2 flex-col h-full">
          <div className='basis-2/3'>
            <Foundation></Foundation>
          </div>
          <Console></Console>
        </div>
      </div>
      <div className="col-span-3 monitor_wrapper">
        <div className="grid grid-rows-2 gap-2 h-full">
          <Logs></Logs>
          <Storage></Storage>
        </div>
      </div>
    </main>
  )
}
