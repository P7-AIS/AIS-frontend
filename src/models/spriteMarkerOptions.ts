import * as PIXI from 'pixi.js'
import L from 'leaflet'

export interface ISpriteMarkerOptions {
  sprite: PIXI.Sprite
  position: L.LatLngTuple
  size: number
}
