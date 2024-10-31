import { IMapOverlay } from '../interfaces/IMapOverlay'
import { IGraphicOptions } from '../models/graphicOptions'
import L from 'leaflet'
import 'leaflet-pixi-overlay'
import * as PIXI from 'pixi.js'

export default class GraphicOverlayHandler implements IMapOverlay {
  private readonly overlay: L.LeafletPixiOverlayDefnition
  private isGraphicsUpdated = true

  constructor(
    private readonly pixiContainer: PIXI.Container,
    private readonly graphicOptions: IGraphicOptions[]
  ) {
    this.overlay = L.pixiOverlay(this.getDrawCallback(), pixiContainer, {
      doubleBuffering: true,
      autoPreventDefault: false,
    })
  }

  updated() {
    this.isGraphicsUpdated = true
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
    let prevZoom: number | null = null

    return (utils) => {
      const container = utils.getContainer()
      const renderer = utils.getRenderer()
      const project = utils.latLngToLayerPoint
      const scale = utils.getScale()
      const map = utils.getMap()
      const zoom = map.getZoom()
      const bounds = map.getBounds()

      if (this.isGraphicsUpdated || prevZoom !== zoom) {
        this.graphicOptions.forEach((option) => {
          option.graphic.clear()
          option.drawGraphic(project, scale, bounds)
        })
      }

      this.isGraphicsUpdated = false
      prevZoom = zoom
      renderer.render(container)
    }
  }
}
