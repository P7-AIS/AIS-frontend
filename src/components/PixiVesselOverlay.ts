import * as PIXI from 'pixi.js'
import L, { LatLng, marker } from 'leaflet'
import { useMap } from 'react-leaflet'
import 'leaflet-pixi-overlay'
import { ISimpleVessel } from '../models/simpleVessel'

const markerTexture = await PIXI.Assets.load('assets/arrow.svg')
const targetWidth = 15
const scaleFactor = targetWidth / markerTexture.width

interface ICusMarker {
  sprite: PIXI.Sprite
  popup: L.Popup
  currentScale: number
  targetScale: number
  vessel: ISimpleVessel
}

function vesselToMarker(mapRef: L.Map, vessel: ISimpleVessel): ICusMarker {
  const sprite = new PIXI.Sprite(markerTexture)
  sprite.eventMode = 'dynamic'
  sprite.cursor = 'pointer'
  sprite.rotation = vessel.location.heading ? (vessel.location.heading * Math.PI) / 180 : 0

  const popup = L.popup({ className: 'pixi-popup' })
    .setLatLng([vessel.location.point.lat, vessel.location.point.lon])
    .setContent(`<b>Hello world!</b><br>I am a ${vessel.mmsi}`)
    .openOn(mapRef)

  return { sprite, popup, vessel, currentScale: 0, targetScale: 0 }
}

export default function PixiVesselOverlay({ vessels }: { vessels: ISimpleVessel[] }) {
  const mapRef = useMap()

  if (vessels.length === 0) return null

  let frame: number | null = null
  let firstDraw = true
  let prevZoom: number | null = null

  const markers = vessels.map((vessel) => vesselToMarker(mapRef, vessel))

  const pixiContainer = new PIXI.Container()
  pixiContainer.addChild(...markers.map((marker) => marker.sprite))

  L.pixiOverlay(
    (utils) => {
      if (frame) {
        cancelAnimationFrame(frame)
        frame = null
      }
      const zoom = utils.getMap().getZoom()
      const container = utils.getContainer()
      const renderer = utils.getRenderer()
      const project = utils.latLngToLayerPoint
      const scale = utils.getScale()

      if (firstDraw) {
        const boundary = new PIXI.EventBoundary(container)
        utils.getMap().on('click', (e) => {
          const interaction = utils.getRenderer().events
          const pointerEvent = e.originalEvent
          const pixiPoint = new PIXI.Point()
          interaction.mapPositionToPoint(pixiPoint, pointerEvent.clientX, pointerEvent.clientY)
          const target = boundary.hitTest(pixiPoint.x, pixiPoint.y)
          // if (target) {
          //   cusMarker.popup.openOn(mapRef)
          // }
        })

        markers.forEach((marker) => {
          const point = new LatLng(marker.vessel.location.point.lat, marker.vessel.location.point.lon)
          const coords = project(point)

          marker.sprite.x = coords.x
          marker.sprite.y = coords.y
          marker.sprite.anchor.set(0.5, 0.2)
          marker.sprite.scale.set((1 / scale) * scaleFactor)
          marker.currentScale = (1 / scale) * scaleFactor
        })
      }

      if (firstDraw || prevZoom !== zoom) {
        markers.forEach((marker) => {
          marker.currentScale = marker.sprite.scale.x
          marker.targetScale = (1 / scale) * scaleFactor
        })

        // We can draw anything PIXI here. For example, a polygon:
      }

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
    },
    pixiContainer,
    {
      doubleBuffering: true,
      autoPreventDefault: false,
    }
  ).addTo(mapRef)

  return null
}
