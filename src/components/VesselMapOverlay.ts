import * as PIXI from 'pixi.js'
import L, { LatLng } from 'leaflet'
import { useMap } from 'react-leaflet'
import 'leaflet-pixi-overlay'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { useEffect } from 'react'

const markerSize = 10
const arrowTexture = await PIXI.Assets.load('assets/arrow.svg')
const circleTexture = await PIXI.Assets.load('assets/circle.svg')

interface DisplayVessel {
  simpleVessel: ISimpleVessel
  monitoredInfo?: IMonitoredVessel
}

function getDisplayVessels(simpleVessels: ISimpleVessel[], monitoredVessels: IMonitoredVessel[]): DisplayVessel[] {
  return simpleVessels.map((simpleVessel) => {
    const monitoredInfo = monitoredVessels.find((monitoredVessel) => monitoredVessel.mmsi === simpleVessel.mmsi)
    return { simpleVessel, monitoredInfo }
  })
}

function trustworthinessToColor(trustworthiness?: number): number {
  if (trustworthiness === undefined) return 0x000000
  if (trustworthiness < 0.5) return 0xff0000
  if (trustworthiness < 0.8) return 0xffff00
  return 0x00ff00
}

function displayVesselToSpriteMarker(vessel: DisplayVessel, selected: boolean, onClick: () => void): SpriteMarker {
  const { simpleVessel, monitoredInfo } = vessel

  let sprite: PIXI.Sprite

  if (simpleVessel.location.heading !== undefined) {
    sprite = new PIXI.Sprite(arrowTexture)
    sprite.anchor.set(0.5, 0.5)
    sprite.rotation = simpleVessel.location.heading ? (simpleVessel.location.heading * Math.PI) / 180 : 0
  } else {
    sprite = new PIXI.Sprite(circleTexture)
    sprite.anchor.set(0.5, 0.5)
  }

  if (monitoredInfo) {
    sprite.tint = trustworthinessToColor(monitoredInfo.trustworthiness)
  } else {
    sprite.alpha = 0.3
    sprite.tint = 0x000000
  }

  if (selected) {
    sprite.alpha = 1
    sprite.tint = 0xff0000
  }

  sprite.eventMode = 'dynamic'
  sprite.cursor = 'pointer'
  sprite.on('click', onClick)

  const popup = L.popup({ className: 'pixi-popup' })
    .setLatLng([simpleVessel.location.point.lat, simpleVessel.location.point.lon])
    .setContent(`Hello im a popup for vessel ${simpleVessel.mmsi}`)

  const position: L.LatLngTuple = [simpleVessel.location.point.lat, simpleVessel.location.point.lon]

  return { sprite, popup, position }
}

export default function VesselMapOverlay({
  simpleVessels,
  monitoredVessels,
}: {
  simpleVessels: ISimpleVessel[]
  monitoredVessels: IMonitoredVessel[]
}) {
  const map = useMap()
  const { selectedVesselmmsi, setSelectedVesselmmsi } = useVesselGuiContext()

  useEffect(() => {
    if (simpleVessels.length === 0) return

    const displayVessels = getDisplayVessels(simpleVessels, monitoredVessels)
    const markers = displayVessels.map((vessel) =>
      displayVesselToSpriteMarker(vessel, selectedVesselmmsi === vessel.simpleVessel.mmsi, () =>
        setSelectedVesselmmsi(vessel.simpleVessel.mmsi)
      )
    )

    const pixiContainer = new PIXI.Container()
    pixiContainer.addChild(...markers.map((marker) => marker.sprite))

    const overlay = L.pixiOverlay(getDrawCallback(markers, markerSize), pixiContainer, {
      doubleBuffering: true,
      autoPreventDefault: false,
    })

    overlay.addTo(map)

    return () => {
      overlay.remove()
      pixiContainer.destroy({ children: true })
    }
  }, [map, selectedVesselmmsi, simpleVessels, monitoredVessels, setSelectedVesselmmsi])

  return null
}

interface SpriteMarker {
  sprite: PIXI.Sprite
  popup: L.Popup
  position: L.LatLngTuple
}

function getDrawCallback(spriteMarkers: SpriteMarker[], targetSize: number): L.DrawCallbackFn {
  let frame: number | null = null
  let firstDraw = true
  let prevZoom: number | null = null

  const markers = spriteMarkers.map((marker) => ({
    ...marker,
    targetScale: 0,
    currentScale: 0,
    scaleFactor: targetSize / marker.sprite.width,
  }))

  return (utils) => {
    if (frame) {
      cancelAnimationFrame(frame)
      frame = null
    }
    const container = utils.getContainer()
    const renderer = utils.getRenderer()
    const project = utils.latLngToLayerPoint
    const scale = utils.getScale()
    const map = utils.getMap()
    const zoom = map.getZoom()

    if (firstDraw) {
      const boundary = new PIXI.EventBoundary(container)
      map.on('click', (e) => {
        const interaction = utils.getRenderer().events
        const pointerEvent = e.originalEvent
        const pixiPoint = new PIXI.Point()
        interaction.mapPositionToPoint(pixiPoint, pointerEvent.clientX, pointerEvent.clientY)
        const target = boundary.hitTest(pixiPoint.x, pixiPoint.y)

        if (target) {
          const marker = markers.find((marker) => marker.sprite === target)
          if (marker) {
            marker.popup.openOn(map)
          }
        }
      })

      markers.forEach((marker) => {
        const point = new LatLng(marker.position[0], marker.position[1])
        const coords = project(point)

        marker.sprite.x = coords.x
        marker.sprite.y = coords.y
        marker.sprite.scale.set((1 / scale) * marker.scaleFactor)
        marker.currentScale = (1 / scale) * marker.scaleFactor
      })
    }

    // Rescale markers on zoom change
    if (firstDraw || prevZoom !== zoom) {
      markers.forEach((marker) => {
        marker.currentScale = marker.sprite.scale.x
        marker.targetScale = (1 / scale) * marker.scaleFactor
      })
    }

    // Animation logic
    const duration = 100
    let start: number | null = null

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = timestamp - start
      let lambda = progress / duration
      if (lambda > 1) lambda = 1
      lambda = lambda * (0.4 + lambda * (2.2 + lambda * -1.6))

      markers.forEach((marker) => {
        marker.sprite.scale.set(marker.currentScale + lambda * (marker.targetScale - marker.currentScale))
      })

      renderer.render(container)
      if (progress < duration) {
        frame = requestAnimationFrame(animate)
      }
    }

    if (!firstDraw && prevZoom !== zoom) {
      start = null
      frame = requestAnimationFrame(animate)
    }

    firstDraw = false
    prevZoom = zoom
    renderer.render(container)
  }
}
