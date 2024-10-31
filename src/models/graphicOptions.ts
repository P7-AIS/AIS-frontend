import * as PIXI from 'pixi.js'

export interface IGraphicOptions {
  graphic: PIXI.Graphics
  drawGraphic: (project: (latlng: L.LatLng) => L.Point, scale: number, bounds: L.LatLngBounds) => void
}
