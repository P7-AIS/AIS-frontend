import * as PIXI from 'pixi.js'
import L, { LatLng } from 'leaflet'
import { useMap } from 'react-leaflet'
import 'leaflet-pixi-overlay'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'

const targetWidth = 10

const arrowTexture = await PIXI.Assets.load('assets/arrow.svg')
const circleTexture = await PIXI.Assets.load('assets/circle.svg')

const arrowScaleFactor = targetWidth / arrowTexture.width
const circleScaleFactor = targetWidth / circleTexture.width

interface MergedVessel {
  simpleVessel: ISimpleVessel
  monitoredInfo?: IMonitoredVessel
}

interface CusMarker {
  sprite: PIXI.Sprite
  popup: L.Popup
  currentScale: number
  targetScale: number
  vessel: MergedVessel
}

function mergeVessels(simpleVessels: ISimpleVessel[], monitoredVessels: IMonitoredVessel[]): MergedVessel[] {
  return simpleVessels.map((simpleVessel) => {
    const monitoredInfo = monitoredVessels.find((monitoredVessel) => monitoredVessel.mmsi === simpleVessel.mmsi)
    return { simpleVessel, monitoredInfo }
  })
}

function mergedVesselToMarker(vessel: MergedVessel, onClick: () => void): CusMarker {
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

  sprite.alpha = 0.3
  sprite.tint = trustworthinessToColor(monitoredInfo?.trustworthiness)

  sprite.eventMode = 'dynamic'
  sprite.cursor = 'pointer'

  sprite.on('click', onClick)

  const popup = L.popup({ className: 'pixi-popup' })
    .setLatLng([simpleVessel.location.point.lat, simpleVessel.location.point.lon])
    .setContent(`Hello im a popup for vessel ${simpleVessel.mmsi}`)

  return { sprite, popup, vessel, currentScale: 0, targetScale: 0 }
}

function trustworthinessToColor(trustworthiness?: number): number {
  if (trustworthiness === undefined) return 0x000000
  if (trustworthiness < 0.5) return 0xff0000
  if (trustworthiness < 0.8) return 0xffff00
  return 0x00ff00
}

export default function VesselMapOverlay({
  simpleVessels,
  monitoredVessels,
}: {
  simpleVessels: ISimpleVessel[]
  monitoredVessels: IMonitoredVessel[]
}) {
  const mapRef = useMap()

  const { setSelectedVesselmmsi } = useVesselGuiContext()

  if (simpleVessels.length === 0) return null

  const mergedVessels = mergeVessels(simpleVessels, monitoredVessels)

  const markers = mergedVessels.map((vessel) =>
    mergedVesselToMarker(vessel, () => setSelectedVesselmmsi(vessel.simpleVessel.mmsi))
  )

  let frame: number | null = null
  let firstDraw = true
  let prevZoom: number | null = null

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

          if (target) {
            const marker = markers.find((marker) => marker.sprite === target)
            if (marker) {
              marker.popup.openOn(mapRef)
            }
          }
        })

        markers.forEach((marker) => {
          const scaleFactor = marker.sprite.texture === arrowTexture ? arrowScaleFactor : circleScaleFactor

          const point = new LatLng(
            marker.vessel.simpleVessel.location.point.lat,
            marker.vessel.simpleVessel.location.point.lon
          )
          const coords = project(point)

          marker.sprite.x = coords.x
          marker.sprite.y = coords.y
          marker.sprite.scale.set((1 / scale) * scaleFactor)
          marker.currentScale = (1 / scale) * scaleFactor
        })
      }

      if (firstDraw || prevZoom !== zoom) {
        markers.forEach((marker) => {
          const scaleFactor = marker.sprite.texture === arrowTexture ? arrowScaleFactor : circleScaleFactor
          marker.currentScale = marker.sprite.scale.x
          marker.targetScale = (1 / scale) * scaleFactor
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
    },
    pixiContainer,
    {
      doubleBuffering: true,
      autoPreventDefault: false,
    }
  ).addTo(mapRef)

  return null
}
