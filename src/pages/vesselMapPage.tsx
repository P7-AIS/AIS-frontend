import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { useState, useEffect } from 'react'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import LMap from '../components/map'
import VesselMarker from '../components/vesselMarker'
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import L from 'leaflet'
import MonitoringMenu from '../components/monitoringMenu'
import MonitoringMenuRow from '../components/monitoringMenuRow'
import Toolbar from '../components/toolbar'

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
    setMonitoredVessels([
      {...vessel, trustworthiness:0.20, reason:"therefore"},
      {...vessel1, trustworthiness:0.30, reason:"therefore"},
    ])
  }, [])


  function zoomToVessel(vessel: ISimpleVessel) {
    if (map !== null) {
      map.flyTo([vessel.location.point.lat, vessel.location.point.lon], 13)
    }
  }

  return (
    <div className="relative">
      <div className="absolute z-10 bg-neutral_2 w-96">
        <p>Here is the page </p>
        {map!== null && 
          <Toolbar map={map} />
        }
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
                  zoomToCallback={zoomToVessel}
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
