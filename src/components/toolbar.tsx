import { ActiveGuiTool, useVesselGuiContext } from '../contexts/vesselGuiContext'
import { Polygon } from 'leaflet'
import L from 'leaflet'
import { useCallback, useEffect } from 'react'
import Point, { IPoint } from '../models/point'
import ClearSVG from '../svgs/clearSVG'
import PolygonSVG from '../svgs/polygonSVG'
import RectangleSVG from '../svgs/rectangleSVG'

interface IToolbarProps {
  map: L.Map
  onMonitoringAreaChange: (area: IPoint[] | undefined) => void
}

export default function Toolbar({ map, onMonitoringAreaChange }: IToolbarProps) {
  const { activeTool, setActiveTool } = useVesselGuiContext()

  const clearTool = useCallback(() => {
    if (map !== null) {
      map.eachLayer(function (layer: L.Layer) {
        if (!(layer instanceof L.TileLayer || layer instanceof L.Marker)) {
          map.removeLayer(layer)
        }
      })
    }
  }, [map, onMonitoringAreaChange])

  function clearOnClick() {
    clearTool()
    setActiveTool(ActiveGuiTool.Mouse)
    map.pm.disableDraw()
    onMonitoringAreaChange(undefined)
  }

  useEffect(() => {
    if (activeTool !== ActiveGuiTool.Mouse) {
      clearTool()
      map.pm.enableDraw(activeTool, { snappable: false })
    }
  }, [activeTool, clearTool, map.pm])

  useEffect(() => {
    if (map !== null) {
      map.on('pm:create', function (e) {
        if (['Polygon', 'Rectangle'].includes(e.shape)) {
          console.log((e.layer as Polygon).toGeoJSON())
          //change in monitored area
          onMonitoringAreaChange(
            (e.layer as Polygon)
              .toGeoJSON()
              .geometry.coordinates[0].map((loc) => new Point(loc[1] as number, loc[0] as number))
          )
          setActiveTool(ActiveGuiTool.Mouse)
        }
      })
    }

    return () => {
      if (map !== null) {
        map.off('pm:create')
      }
    }
  }, [map, setActiveTool, onMonitoringAreaChange])

  return (
    <div className="flex flex-col gap-4 bg-gray-700 text-gray-300 rounded-lg p-4 w-fit">
      <h2 className="text-white text-lg font-bold">Focus area tools</h2>
      
      <div id="tools" className="flex gap-4 items-center">
        <button title="Draw focus area as rectangle" className={`hover:text-gray-100 hover:scale-110 transition-all ${activeTool===ActiveGuiTool.Rectangle ? "text-blue-500" : ""}`} onClick={() => setActiveTool(ActiveGuiTool.Rectangle)}>
          <RectangleSVG/>
        </button>
        <button title="Draw focus area as polygon" className={`hover:text-gray-100 hover:scale-110 transition-all ${activeTool===ActiveGuiTool.Polygon ? "text-blue-500" : ""}`} onClick={() => setActiveTool(ActiveGuiTool.Polygon)}>
          <PolygonSVG/>
        </button>
        <button title="Clear focus area" className="bi bi-eraser hover:text-gray-100 hover:scale-110 transition-all" onClick={clearOnClick}>
          <ClearSVG/>
        </button>
      </div>
    </div>
  )
}
