import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { useState, useEffect } from 'react'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import Vessel from '../components/vessel'
import LMap from '../components/map'
import VesselMarker from '../components/vesselMarker'
import 'leaflet/dist/leaflet.css'

export default function VesselMapPage() {
  const [allVessels, setAllVessels] = useState<ISimpleVessel[] | undefined>(undefined)
  const [monitoredVessels, setMonitoredVessels] = useState<IMonitoredVessel[] | undefined>(undefined)

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
    mmsi: 123,
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

  return (
    <>
      <h1>Here is the page {pathHistory ? 'true' : 'false'}</h1>
      <Vessel isMonitored={false} vessel={vessel}></Vessel>
      <div className="h-screen w-screen">
        <LMap>
          {allVessels?.map((vessel) => {
            return <VesselMarker vessel={vessel}></VesselMarker>
          })}
        </LMap>
      </div>
    </>
  )
}
