import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { useState, useEffect } from 'react'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import Vessel from '../components/vessel'
import LMap from '../components/map'
import VesselMarker from '../components/vesselMarker'
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import { Polygon } from 'leaflet'
import L from 'leaflet'

export default function VesselMapPage() {
  const [allVessels, setAllVessels] = useState<ISimpleVessel[] | undefined>(undefined)
  const [monitoredVessels, setMonitoredVessels] = useState<IMonitoredVessel[] | undefined>(undefined)
  const [map, setMap] = useState<L.Map | null>(null)

  const { pathHistory } = useVesselGuiContext()

  const vessel: ISimpleVessel = {
    mmsi: 123,
    location: {
      heading: 45,
      timestamp: new Date(),
      point: {
        lat: 56.15674,
        lon: 10.21076,
      },
    },
  }
  const vessel1: ISimpleVessel = {
    mmsi: 321,
    location: {
      heading: 25,
      timestamp: new Date(),
      point: {
        lat: 56.25674,
        lon: 10.21076,
      },
    },
  }

  useEffect(() => {
    setAllVessels([vessel, vessel1])
  }, [])

  function enableTool() {
    if (map) {
      map.pm.enableDraw('Polygon', { snappable: true })
    }
  }

  if (map !== null) {
    map.on('pm:create', function (e) {
      if (e.shape === 'Polygon') {
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
    <>
      <h1>Here is the page {pathHistory ? 'true' : 'false'}</h1>
      <Vessel isMonitored={false} vessel={vessel}></Vessel>
      <span>
        <button onClick={enableTool}>test tool</button>
        <button onClick={clearTool}>clear</button>
      </span>
      <div className="h-screen w-screen">
        <LMap setMapRef={setMap}>
          {allVessels?.map((vessel) => {
            return <VesselMarker key={vessel.mmsi} vessel={vessel}></VesselMarker>
          })}
        </LMap>
      </div>
    </>
  )
}
