import { ActiveGuiTool, useVesselGuiContext } from '../contexts/vesselGuiContext'
import { Polygon } from 'leaflet'
import L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import { useCallback, useEffect } from 'react'
import { IPoint } from '../models/point'
import { ISelectionArea } from '../models/selectionArea'
import ClearSVG from '../svgs/clearSVG'
import PolygonSVG from '../svgs/polygonSVG'
import RectangleSVG from '../svgs/rectangleSVG'

interface IToolbarProps {
  map: L.Map
  onMonitoringAreaChange: (area: IPoint[] | undefined) => void
  setSelectionArea: React.Dispatch<React.SetStateAction<ISelectionArea>>
}

export default function Toolbar({ map, onMonitoringAreaChange, setSelectionArea }: IToolbarProps) {
  const { activeTool, setActiveTool } = useVesselGuiContext()

  const clearTool = useCallback(() => {
    if (map !== null) {
      map.eachLayer(function (layer: L.Layer) {
        if (!(layer instanceof L.TileLayer || layer instanceof L.Marker) && layer.options.pane === 'monitoring-area') {
          map.removeLayer(layer)
        }
      })
    }
    setSelectionArea({ points: [] })
  }, [map, setSelectionArea])

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
          e.layer.options.pane = 'monitoring-area'

          const points = (e.layer as Polygon)
            .toGeoJSON()
            .geometry.coordinates[0].map((loc) => ({ lat: loc[1] as number, lon: loc[0] as number }))

          //change in monitored area
          onMonitoringAreaChange(points)
          setSelectionArea({ points })

          map.removeLayer(e.layer)

          setActiveTool(ActiveGuiTool.Mouse)
        }
      })
    }

    return () => {
      if (map !== null) {
        map.off('pm:create')
      }
    }
  }, [map, setActiveTool, onMonitoringAreaChange, setSelectionArea, clearTool])

  const handleChangeTool = (tool: ActiveGuiTool) => {
    onMonitoringAreaChange(undefined)
    setActiveTool(tool)
  }

  return (
    <div className="flex flex-row gap-4 bg-gray-700 text-gray-300 rounded-lg p-4 justify-between w-full">
      <h2 className="text-white text-lg font-bold">Focus area tools</h2>

      <div id="tools" className="flex gap-4 items-center">
        <button
          title="Draw focus area as rectangle"
          className={`hover:text-gray-100 hover:scale-110 transition-all ${
            activeTool === ActiveGuiTool.Rectangle ? 'text-blue-500' : ''
          }`}
          onClick={() => handleChangeTool(ActiveGuiTool.Rectangle)}
        >
          <RectangleSVG width={24} />
        </button>
        <button
          title="Draw focus area as polygon"
          className={`hover:text-gray-100 hover:scale-110 transition-all ${
            activeTool === ActiveGuiTool.Polygon ? 'text-blue-500' : ''
          }`}
          onClick={() => handleChangeTool(ActiveGuiTool.Polygon)}
        >
          <PolygonSVG width={24} />
        </button>
        <button
          title="Clear focus area"
          className="bi bi-eraser hover:text-gray-100 hover:scale-110 transition-all"
          onClick={clearOnClick}
        >
          <ClearSVG width={24} />
        </button>
      </div>
    </div>
  )
}
