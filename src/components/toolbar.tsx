import { ActiveGuiTool, useVesselGuiContext } from '../contexts/vesselGuiContext'
import { Polygon } from 'leaflet'
import L from 'leaflet'
import { useEffect } from 'react'

interface IToolbarProps {
  map: L.Map
}

export default function Toolbar({ map }: IToolbarProps) {
  const { activeTool, setActiveTool } = useVesselGuiContext()

  useEffect(() => {
    switch (activeTool) {
      case ActiveGuiTool.Polygon:
        map.pm.enableDraw('Polygon', { snappable: true })
        break
      case ActiveGuiTool.Rectangle:
        map.pm.enableDraw('Rectangle', { snappable: true })
        break
      default:
        break
    }
  }, [activeTool, map.pm])

  if (map !== null) {
    map.on('pm:create', function (e) {
      if (['Polygon', 'Rectangle'].includes(e.shape)) {
        //TODO: her skal der nok sendes en request til backend med nyt valgte område
        console.log((e.layer as Polygon).toGeoJSON())
      }
    })
  }

  function clearTool() {
    if (map !== null) {
      map.eachLayer(function (layer: L.Layer) {
        if (!(layer instanceof L.TileLayer || layer instanceof L.Marker)) {
          map.removeLayer(layer)
        }
      })
    }
  }

  return (
    <span className="inline-flex flex-col space-y-1">
      <button onClick={() => setActiveTool(ActiveGuiTool.Rectangle)}>
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

      <button onClick={() => setActiveTool(ActiveGuiTool.Polygon)}>
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

      <button className="bi bi-eraser" onClick={clearTool}>
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
    </span>
  )
}
