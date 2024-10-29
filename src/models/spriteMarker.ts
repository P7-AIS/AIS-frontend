import * as PIXI from 'pixi.js'

export interface SpriteMarker {
  id: number
  sprite: PIXI.Sprite
  popup: L.Popup
  position: L.LatLngTuple
  size: number
}
