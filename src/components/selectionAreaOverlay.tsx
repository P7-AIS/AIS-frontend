import * as PIXI from 'pixi.js'
import { useEffect, useState } from 'react'
import { ISelectionArea } from '../models/selectionArea'
import { useMap } from 'react-leaflet'
import GraphicOverlayHandler from '../implementations/GraphicOverlayHandler'
import { IGraphicOptions } from '../models/graphicOptions'
import L from 'leaflet'

export default function SelectionAreaOverlay({ selectionArea }: { selectionArea: ISelectionArea }) {
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

    if (selectionArea.points.length < 4 && selectionArea.points.length > 0) {
      return
    }

    if (selectionArea.points.length === 0) {
      overlay.updated()
      overlay.redraw()
      return
    }

    graphicOptions.push(selectionAreaToGraphicOption(selectionArea))

    if (graphicOptions.length !== 0) {
      pixiContainer.addChild(...graphicOptions.map((option) => option.graphic))
      overlay.updated()
      overlay.redraw()
    }
  }, [graphicOptions, overlay, pixiContainer, selectionArea])

  return null
}

function selectionAreaToGraphicOption(selectionArea: ISelectionArea): IGraphicOptions {
  const graphic = new PIXI.Graphics()

  const drawGraphic = (project: (latLng: L.LatLng) => L.Point, scale: number, bounds: L.LatLngBounds) => {
    const outerBounds = [
      bounds.getNorthWest(),
      bounds.getNorthEast(),
      bounds.getSouthEast(),
      bounds.getSouthWest(),
    ].map(project)

    const projectedCords = selectionArea.points.map((point) => {
      const coords = new L.LatLng(point.lat, point.lon)
      const projection = project(coords)
      console.log(point, projection)
      return projection
    })

    graphic.clear()

    // graphic.lineStyle(3 / scale, 0x3388ff, 1)
    // graphic.x = outerBounds[0].x
    // graphic.y = outerBounds[0].y
    // outerBounds.forEach((coords, index) => {
    //   if (index == 0) graphic.moveTo(0, 0)
    //   else graphic.lineTo(coords.x - graphic.x, coords.y - graphic.y)
    // })

    // graphic.beginHole()

    // graphic.beginFill(0xff0000, 0.2)
    // graphic.lineStyle(3 / scale, 0x3388ff, 1)
    // graphic.x = projectedCords[0].x
    // graphic.y = projectedCords[0].y
    // projectedCords.forEach((coords, index) => {
    //   if (index == 0) graphic.moveTo(0, 0)
    //   else graphic.lineTo(coords.x - graphic.x, coords.y - graphic.y)
    // })
    // graphic.endFill()

    // graphic.endHole()
  }

  return { graphic, drawGraphic }
}
