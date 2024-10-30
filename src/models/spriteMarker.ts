import * as PIXI from 'pixi.js'

export interface ISpriteMarker {
  id: number
  sprite: PIXI.Sprite
  popupContent: string
  position: L.LatLngTuple
  size: number
}
