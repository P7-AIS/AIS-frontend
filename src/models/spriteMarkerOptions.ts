import * as PIXI from 'pixi.js'
import L from 'leaflet'

export interface ISpriteMarkerOptions {
  id: number
  sprite: PIXI.Sprite
  getPopupContent: () => Promise<string>
  position: L.LatLngTuple
  size: number
}
