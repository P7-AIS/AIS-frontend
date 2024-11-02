import { useState, useEffect } from 'react'
import { ILocation } from '../models/location'
import * as PIXI from 'pixi.js'
import GraphicOverlayHandler from '../implementations/GraphicOverlayHandler'
import { IGraphicOptions } from '../models/graphicOptions'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

interface IPathOverlayProps {
  path: ILocation[]
  idx: number
}
export default function PathOverlay({ path, idx }: IPathOverlayProps) {
  const [graphicOptions] = useState<IGraphicOptions[]>([])
  const [pixiContainer] = useState(new PIXI.Container())
  const [overlay] = useState(new GraphicOverlayHandler(pixiContainer, graphicOptions))
  const [arrowTexture, setArrowTexture] = useState<PIXI.Texture | null>(null)

  const map = useMap()

  useEffect(() => {
    const loadTextures = async () => {
      const loadedArrowTexture = await PIXI.Assets.load('assets/arrow.svg')
      setArrowTexture(loadedArrowTexture)
    }
    loadTextures()
  }, [])

  useEffect(() => {
    overlay.applyToMap(map)
    return () => {
      overlay.removeFromMap()
    }
  }, [map, overlay])

  useEffect(() => {
    if (arrowTexture === null) {
      return
    }
    pixiContainer.removeChildren()
    graphicOptions.splice(0, graphicOptions.length)

    if (path.length === 0) {
      //clear path and draw nothing if path is empty
      overlay.updated()
      overlay.redraw()
    } else {
      graphicOptions.push(pathToGraphic(path))
      graphicOptions.push(vesselToGraphic(path[idx], arrowTexture))
    }

    if (graphicOptions.length !== 0) {
      pixiContainer.addChild(...graphicOptions.map((option) => option.graphic))
      overlay.updated()
      overlay.redraw()
    }
  }, [path, pixiContainer, graphicOptions, overlay, arrowTexture, idx])

  return null
}

function pathToGraphic(path: ILocation[]): IGraphicOptions {
  const graphic = new PIXI.Graphics()

  const drawGraphic = (project: (latLng: L.LatLng) => L.Point, scale: number) => {
    const projectedCords = path.map((loc) => {
      const coords = new L.LatLng(loc.point.lat, loc.point.lon)
      const projection = project(coords)
      return projection
    })
    graphic.clear()

    graphic.lineStyle(1 / scale, 0xff0000, 1)
    graphic.moveTo(projectedCords[0].x, projectedCords[0].y)
    for (let i = 1; i < projectedCords.length; i++) {
      graphic.lineTo(projectedCords[i].x, projectedCords[i].y)
    }
  }

  return { graphic, drawGraphic }
}

function vesselToGraphic(location: ILocation, texture: PIXI.Texture): IGraphicOptions {
  const graphic = new PIXI.Graphics()

  const drawGraphic = (project: (latLng: L.LatLng) => L.Point, scale: number) => {
    const projectedCords = project(new L.LatLng(location.point.lat, location.point.lon))
    graphic.removeChildren()
    const sprite: PIXI.Sprite = new PIXI.Sprite(texture)
    sprite.anchor.set(0.5, 0.5)
    sprite.rotation = Math.PI / 2 + (location.heading ? (location.heading * Math.PI) / 180 : 0)
    sprite.tint = 0xff0000
    sprite.x = projectedCords.x
    sprite.y = projectedCords.y
    sprite.scale.set(0.01 / scale)
    graphic.addChild(sprite)
  }

  return { graphic, drawGraphic }
}
