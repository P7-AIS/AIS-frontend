import * as PIXI from 'pixi.js'

export interface ISpriteMarkerOptions {
  id: number
  sprite: PIXI.Sprite
  getPopupContent: () => Promise<string>
  position: L.LatLngTuple
  size: number
}
