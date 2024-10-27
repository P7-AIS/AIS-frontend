import * as PIXI from 'pixi.js'
import L from 'leaflet'
import { useMap } from 'react-leaflet'
import 'leaflet-pixi-overlay'

const markerTexture = await PIXI.Assets.load('assets/marker.png')
const markerLatLng = [56.15674, 10.21076]
const targetWidth = 30
const scaleFactor = targetWidth / markerTexture.width

interface ICusMarker {
  sprite: PIXI.Sprite
  popup: L.Popup
  currentScale: number
  targetScale: number
}

export default function PixiOverlay() {
  const mapRef = useMap()

  let frame: number | null = null
  let firstDraw = true
  let prevZoom: number | null = null

  const sprite = new PIXI.Sprite(markerTexture)
  sprite.interactive = true
  sprite.cursor = 'pointer'

  const popup = L.popup({ className: 'pixi-popup' })
    .setLatLng(markerLatLng as L.LatLngExpression)
    .setContent('<b>Hello world!</b><br>I am a popup.')
    .openOn(mapRef)

  const cusMarker: ICusMarker = { sprite, popup, currentScale: 0, targetScale: 0 }

  const pixiContainer = new PIXI.Container()
  pixiContainer.addChild(cusMarker.sprite)

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
          // get global click position in pixiPoint:
          interaction.mapPositionToPoint(pixiPoint, pointerEvent.clientX, pointerEvent.clientY)
          // get what is below the click if any:
          const target = boundary.hitTest(pixiPoint.x, pixiPoint.y)
          if (target) {
            cusMarker.popup.openOn(mapRef)
          }
        })

        console.log(targetWidth)
        const markerCoords = project(new L.LatLng(markerLatLng[0], markerLatLng[1]))
        cusMarker.sprite.x = markerCoords.x
        cusMarker.sprite.y = markerCoords.y
        cusMarker.sprite.anchor.set(0.5, 1)
        cusMarker.sprite.scale.set((1 / scale) * scaleFactor)
        cusMarker.currentScale = (1 / scale) * scaleFactor
      }

      if (firstDraw || prevZoom !== zoom) {
        cusMarker.currentScale = cusMarker.sprite.scale.x
        cusMarker.targetScale = (1 / scale) * scaleFactor

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
        cusMarker.sprite.scale.set(cusMarker.currentScale + lambda * (cusMarker.targetScale - cusMarker.currentScale))
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
