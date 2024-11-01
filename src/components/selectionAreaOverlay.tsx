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

  const outerBounds = [
    { x: 0, y: 0 },
    { x: 0, y: 370727 },
    { x: 370727, y: 370727 },
    { x: 370727, y: 0 },
  ]

  const drawGraphic = (project: (latLng: L.LatLng) => L.Point, scale: number) => {
    graphic.clear()

    graphic.beginFill(0x000000, 0.2)
    outerBounds.forEach((coords) => {
      graphic.lineTo(coords.x - graphic.x, coords.y - graphic.y)
    })
    graphic.endFill()

    const projectedCords = selectionArea.points.map((point) => {
      const coords = new L.LatLng(point.lat, point.lon)
      const projection = project(coords)
      return projection
    })

    graphic.beginHole()
    graphic.moveTo(projectedCords[0].x - graphic.x, projectedCords[0].y - graphic.y)
    projectedCords.forEach((coords) => {
      graphic.lineTo(coords.x - graphic.x, coords.y - graphic.y)
    })
    graphic.endHole()

    // Glem det jones
    // graphic.lineStyle(2 / scale, 0x3388ff, 1)
    graphic.lineStyle(1 / scale, 0x000, 0.3)

    graphic.beginFill(0x000000, 0)
    graphic.moveTo(projectedCords[0].x - graphic.x, projectedCords[0].y - graphic.y)
    projectedCords.forEach((coords) => {
      graphic.lineTo(coords.x - graphic.x, coords.y - graphic.y)
    })
    graphic.endFill()
  }

  return { graphic, drawGraphic }
}
