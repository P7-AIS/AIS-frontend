import * as PIXI from 'pixi.js'
import L, { LatLng } from 'leaflet'
import { useMap } from 'react-leaflet'
import 'leaflet-pixi-overlay'
import { useEffect } from 'react'
import { SpriteMarker } from '../models/spriteMarker'

export default function SpriteMarkerOverlay({
  markers,
  pixiContainer,
}: {
  markers: SpriteMarker[]
  pixiContainer: PIXI.Container
}) {
  const map = useMap()

  useEffect(() => {
    console.log('asdadaodskapokdspaoksd')
    console.log(markers)

    const overlay = L.pixiOverlay(getDrawCallback(markers), pixiContainer, {
      doubleBuffering: true,
      autoPreventDefault: false,
    })

    overlay.addTo(map)

    return () => {
      console.log('destroying overlay')

      overlay.utils.getRenderer().destroy()

      overlay.remove()
      pixiContainer.destroy({ children: true })
    }
  }, [map, markers, pixiContainer])

  return null
}

function getDrawCallback(spriteMarkers: SpriteMarker[]): L.DrawCallbackFn {
  let frame: number | null = null
  let firstDraw = true
  let prevZoom: number | null = null

  const markers = spriteMarkers.map((marker) => ({
    ...marker,
    targetScale: 0,
    currentScale: 0,
    scaleFactor: marker.size / marker.sprite.width,
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
