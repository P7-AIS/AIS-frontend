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

  const map = useMap()

  useEffect(() => {
    overlay.applyToMap(map)
    return () => {
      overlay.removeFromMap()
    }
  }, [map, overlay])

  useEffect(() => {
    pixiContainer.removeChildren()
    graphicOptions.splice(0, graphicOptions.length)

    if (path.length === 0) {
      //clear path and draw nothing if path is empty
      overlay.updated()
      overlay.redraw()
    }

    graphicOptions.push(pathToGraphic(path))
    // graphicOptions.push(vesselToGraphic(path[idx]))

    if (graphicOptions.length !== 0) {
      pixiContainer.addChild(...graphicOptions.map((option) => option.graphic))
      overlay.updated()
      overlay.redraw()
    }
  }, [path, pixiContainer, graphicOptions, overlay])

  return null
}

function pathToGraphic(path: ILocation[]): IGraphicOptions {
  const graphic = new PIXI.Graphics()

  const drawGraphic = (project: (latLng: L.LatLng) => L.Point, scale: number, bounds: L.LatLngBounds) => {
    const projectedCords = path.map((loc) => {
      const coords = new L.LatLng(loc.point.lat, loc.point.lon)
      const projection = project(coords)
      return projection
    })
    graphic.clear()

    graphic.lineStyle(2, 0xff0000, 1)
    graphic.moveTo(projectedCords[0].x, projectedCords[0].y)
    for (let i = 1; i < projectedCords.length; i++) {
      graphic.lineTo(projectedCords[i].x, projectedCords[i].y)
    }
  }

  return { graphic, drawGraphic }
}

// function vesselToGraphic(point: ILocation): IGraphicOptions {}
