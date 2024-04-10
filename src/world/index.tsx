import React, { useRef, useEffect } from "react"
import { Application, Assets, Point, Sprite, Container, Graphics } from 'pixi.js'
import '@pixi/events'

async function cacheAssets () {
  const assets = [
    { alias: 'tile_grid', src: '/tile_grid.png' },
    { alias: 'ship', src: '/ship.png' }
];
await Assets.load(assets)
}

async function loadMap (size: Point) {
  const mapData = []
  for (let y = 0; y < size.y; y++) {
    for (let x = 0; x < size.x; x++) {
      mapData.push({ x, y, tileId: 'tile_grid' })
    }
  }
  return mapData
}

const store = {
  ship: {
    x: 128,
    y: 128
  },
  target: null
}

function moveTo () {
  if (store.target) {
    pool.ship.rotation = Math.atan2(store.target.y - store.ship.y, store.target.x - store.ship.x) + Math.PI / 2
  }
}

function clickTile (e) {
  const tile = e.target
  if (tile.data) {
    store.target = tile.data
    moveTo()
  }
}

const pool: any = {
  map: null,
  ship: null
}

const render = async (app) => {
  const mapData = await loadMap(new Point(256, 256))
  const mapContainer = new Container()
  mapData.forEach((data) => {
    const tile: any = Sprite.from(data.tileId)
    tile.anchor.set(0.5)
    tile.x = data.x * 16
    tile.y = data.y * 16
    tile.width = 16
    tile.height = 16
    tile.eventMode = 'static'
    tile.on('pointerup', clickTile)
    tile.data = data
    tile.id = `${data.x}_${data.y}`
    pool[tile.id] = tile
    mapContainer.addChild(tile)
  })
  app.stage.addChild(mapContainer)
  pool.map = mapContainer

  const ship = Sprite.from('ship')
  ship.anchor.set(0.5)
  ship.x = store.ship.x * 16
  ship.y = store.ship.y * 16
  ship.width = 42
  ship.height = 60
  mapContainer.addChild(ship)
  pool.ship = ship
}

const updateWrapper = app => ticker => {

  // 移动地图, 保持船在屏幕中央
  pool.map.x = -store.ship.x * 16 + app.screen.width / 2
  pool.map.y = -store.ship.y * 16 + app.screen.height / 2

  // path
  if (store.target) {
    if (pool.target) {
      pool.target.destroy()
    }
    const target = new Graphics()
    target.moveTo(store.target.x * 16, store.target.y * 16)
    target.lineTo(store.ship.x * 16, store.ship.y * 16)
    target.stroke({ width: 2, color: 0x35cc5a })
    pool.target = target
    pool.map.addChild(target)

    store.ship.x += (store.target.x - store.ship.x) / 100
    store.ship.y += (store.target.y - store.ship.y) / 100

    if (Math.abs(store.target.x - store.ship.x) < 1 && Math.abs(store.target.y - store.ship.y) < 1) {
      store.ship = store.target
      store.target = null
      pool.target.destroy()
    }

    pool.ship.x = store.ship.x * 16
    pool.ship.y = store.ship.y * 16

  }
}

async function initGames (app) {
  await cacheAssets()
  await render(app)
  const update = updateWrapper(app)
  app.ticker.add((ticker) => {
    update(ticker)
  })
}
export default function WorldMap() {
  const appRef = useRef(null)
  const domRef = useRef(null)
  useEffect(() => {
    if (appRef.current) return
    const app = new Application()
    app.init({ background: '#444d56', width: 640, height: 480 }).then(async () => {
      domRef.current.appendChild(app.canvas)
      initGames(app)
    })
    appRef.current = app
    ;(window as any).world = app
  }, [])

  return (
    <div id="world_map" ref={domRef}></div> // This is where the PixiJS app will be rendered
  )
}
