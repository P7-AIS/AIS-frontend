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
import MonitoringMenu from '../components/monitoringMenu'
import MonitoringMenuRow from '../components/monitoringMenuRow'

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
    <div className="relative">
      <div className="absolute z-10 bg-neutral_2 w-96">
        <p>Here is the page </p>
        <Vessel isMonitored={false} vessel={vessel}></Vessel>
        <span>
          <button onClick={enableTool}>test tool</button>
          <button onClick={clearTool}>clear</button>
        </span>
      </div>

      <div
        id="monitoring-menu-container"
        className="absolute max-w-96 max-h-1/3 top-0 right-0 z-10 bg-neutral_2"
      >
        {monitoredVessels && (
          <MonitoringMenu monitoredVessels={monitoredVessels}>
            {monitoredVessels.map((vessel: IMonitoredVessel) => {
              return (
                <MonitoringMenuRow
                  key={vessel.mmsi}
                  monitoredVessel={vessel}
                  isSelected={false}
                ></MonitoringMenuRow>
              );
            })}
          </MonitoringMenu>
        )}
      </div>

      {/* Map */}
      <div className="h-screen w-screen absolute top-0 left-0 z-0">
        <LMap setMapRef={setMap}>
          {allVessels?.map((vessel) => (
            <VesselMarker key={vessel.mmsi} vessel={vessel}></VesselMarker>
          ))}
        </LMap>
      </div>
    </div>


  )
}
