import { ActiveGuiTool, useVesselGuiContext } from '../contexts/vesselGuiContext'
import { Polygon } from 'leaflet'
import L from 'leaflet'
import { useCallback, useEffect } from 'react'
import Point, { IPoint } from '../models/point'

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
    <div className="flex flex-col gap-4 bg-gray-700 text-gray-300 rounded-lg p-4">
      <p className="text-white">Focus area tools</p>
      
      <div id="tools" className="flex gap-4 items-center">
        <button title="Draw monitoring area as rectangle" className={`hover:text-gray-100 ${activeTool===ActiveGuiTool.Rectangle ? "text-blue-500" : ""}`} onClick={() => setActiveTool(ActiveGuiTool.Rectangle)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            className="bi bi-square"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
          </svg>
        </button>

        <button title="Draw monitoring area as polygon" className={`hover:text-gray-100 ${activeTool===ActiveGuiTool.Polygon ? "text-blue-500" : ""}`} onClick={() => setActiveTool(ActiveGuiTool.Polygon)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            className="bi bi-heptagon"
            viewBox="0 0 16 16"
          >
            <path d="M7.779.052a.5.5 0 0 1 .442 0l6.015 2.97a.5.5 0 0 1 .267.34l1.485 6.676a.5.5 0 0 1-.093.415l-4.162 5.354a.5.5 0 0 1-.395.193H4.662a.5.5 0 0 1-.395-.193L.105 10.453a.5.5 0 0 1-.093-.415l1.485-6.676a.5.5 0 0 1 .267-.34zM2.422 3.813l-1.383 6.212L4.907 15h6.186l3.868-4.975-1.383-6.212L8 1.058z" />
          </svg>
        </button>

        <button title="Clear monitoring area" className="bi bi-eraser hover:text-gray-100 " onClick={clearOnClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            className="bi bi-eraser"
            viewBox="0 0 16 16"
          >
            <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
