import * as PIXI from 'pixi.js'
import L, { LatLng } from 'leaflet'
import { useMap } from 'react-leaflet'
import 'leaflet-pixi-overlay'
import { ISimpleVessel } from '../models/simpleVessel'

const targetWidth = 15

interface ICusMarker {
  vessel: ISimpleVessel
  popup: L.Popup
}

function vesselToMarker(mapRef: L.Map, vessel: ISimpleVessel): ICusMarker {
  const popup = L.popup({ className: 'pixi-popup' })
  // .setLatLng([vessel.location.point.lat, vessel.location.point.lon])
  // .setContent(`<b>Hello world!</b><br>I am a ${vessel.mmsi}`)
  // .openOn(mapRef)

  return { popup, vessel }
}

export default function PixiVesselOverlay({ vessels }: { vessels: ISimpleVessel[] }) {
  const mapRef = useMap()

  if (vessels.length === 0) return null

  let firstDraw = true
  let prevZoom: number | null = null

  const markers = vessels.map((vessel) => vesselToMarker(mapRef, vessel))

  const graphics = new PIXI.Graphics()
  graphics.eventMode = 'dynamic'
  graphics.cursor = 'pointer'

  const pixiContainer = new PIXI.Container()
  pixiContainer.addChild(graphics)

  L.pixiOverlay(
    (utils) => {
      const zoom = utils.getMap().getZoom()
      const container = utils.getContainer()
      const renderer = utils.getRenderer()
      const project = utils.latLngToLayerPoint
      const scale = utils.getScale()

      if (firstDraw || prevZoom !== zoom) {
        graphics.clear()
        markers.forEach(({ vessel }) => {
          graphics.lineStyle(3 / scale, 0x3388ff, 1)
          graphics.beginFill(0x3388ff, 0.2)

          const coords = project(new LatLng(vessel.location.point.lat, vessel.location.point.lon))

          // Calculate triangle dimensions and set position
          const halfBase = targetWidth / 2 / scale
          const height = (targetWidth * Math.sqrt(3)) / 2 / scale

          // Draw an equilateral triangle centered at the vessel’s position
          graphics.moveTo(coords.x, coords.y - height / 2)
          graphics.lineTo(coords.x - halfBase, coords.y + height / 2)
          graphics.lineTo(coords.x + halfBase, coords.y + height / 2)
          graphics.lineTo(coords.x, coords.y - height / 2)
          graphics.endFill()
        })
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
