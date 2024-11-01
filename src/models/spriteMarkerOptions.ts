import * as PIXI from 'pixi.js'
import L from 'leaflet'

export interface ISpriteMarkerOptions {
  id: number
  sprite: PIXI.Sprite
  position: L.LatLngTuple
  size: number
}
