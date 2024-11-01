import * as PIXI from 'pixi.js'
import L, { LatLng } from 'leaflet'
import 'leaflet-pixi-overlay'
import { ISpriteMarkerOptions } from '../models/spriteMarkerOptions'
import { IMapOverlay } from '../interfaces/IMapOverlay'

export default class SpriteMarkerOverlayHandler implements IMapOverlay {
  private readonly overlay: L.LeafletPixiOverlayDefnition
  private isMarkersUpdated = true

  constructor(
    private readonly markerOptions: ISpriteMarkerOptions[],
    private readonly pixiContainer: PIXI.Container
  ) {
    this.overlay = L.pixiOverlay(this.getDrawCallback(), pixiContainer, {
      doubleBuffering: true,
      autoPreventDefault: false,
    })
  }

  updated() {
    this.isMarkersUpdated = true
  }

  redraw() {
    this.overlay.redraw(this.pixiContainer)
  }

  applyToMap(map: L.Map) {
    console.log('applied')
    this.overlay.addTo(map)
  }

  removeFromMap() {
    console.log('removed')
    this.overlay.remove()
  }

  private getDrawCallback(): L.DrawCallbackFn {
    let frame: number | null = null
    let prevZoom: number | null = null

    const getMarkers = () =>
      this.markerOptions.map((marker) => ({
        ...marker,
        targetScale: 0,
        currentScale: 0,
        scaleFactor: marker.size / marker.sprite.texture.width,
      }))

    return (utils) => {
      if (frame) {
        cancelAnimationFrame(frame)
        frame = null
      }

      const markers = getMarkers()
      const container = utils.getContainer()
      const renderer = utils.getRenderer()
      const project = utils.latLngToLayerPoint
      const scale = utils.getScale()
      const map = utils.getMap()
      const zoom = map.getZoom()

      if (this.isMarkersUpdated) {
        const boundary = new PIXI.EventBoundary(container)
        map.on('click', async (e) => {
          const interaction = utils.getRenderer().events
          const pointerEvent = e.originalEvent
          const pixiPoint = new PIXI.Point()
          interaction.mapPositionToPoint(pixiPoint, pointerEvent.clientX, pointerEvent.clientY)
          const target = boundary.hitTest(pixiPoint.x, pixiPoint.y)

          console.log(project(new LatLng(e.latlng.lat, e.latlng.lng)))

          if (target) {
            const marker = markers.find((marker) => marker.sprite === target)
            if (marker) {
              const popup = L.popup({ className: 'pixi-popup' }).setLatLng(marker.position)
              popup.setContent('Loading...')
              popup.openOn(map)

              const content = await marker.getPopupContent()
              popup.setContent(content)
            }
          }
        })

        markers.forEach((marker) => {
          const point = new LatLng(marker.position[0], marker.position[1])
          const coords = project(point)

          marker.sprite.x = coords.x
          marker.sprite.y = coords.y
          marker.sprite.scale.set(marker.scaleFactor / scale)
          marker.currentScale = marker.scaleFactor / scale
        })
      }

      // Rescale markers on zoom change
      if (this.isMarkersUpdated || prevZoom !== zoom) {
        markers.forEach((marker) => {
          marker.currentScale = marker.sprite.scale.x
          marker.targetScale = marker.scaleFactor / scale
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

      if (!this.isMarkersUpdated && prevZoom !== zoom) {
        start = null
        frame = requestAnimationFrame(animate)
      }

      this.isMarkersUpdated = false
      prevZoom = zoom
      renderer.render(container)
    }
  }
}
