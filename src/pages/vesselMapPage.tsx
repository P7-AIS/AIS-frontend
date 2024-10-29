import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { useState, useEffect, useMemo, useRef } from 'react'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import LMap from '../components/map'
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import L from 'leaflet'
import MonitoringMenu from '../components/monitoringMenu'
import MonitoringMenuRow from '../components/monitoringMenuRow'
import Toolbar from '../components/toolbar'
import Vessel from '../components/vessel'
import { useAppContext } from '../contexts/appcontext'
import TimeLine from '../components/timeline'
import StreamManager from '../implementations/StreamManager'
import VesselMap from '../components/vesselMap'
import Navbar from '../components/navbar'
import Path from '../components/path'

export default function VesselMapPage() {
  const [allVessels, setAllVessels] = useState<ISimpleVessel[] | undefined>(undefined)
  const [monitoredVessels, setMonitoredVessels] = useState<IMonitoredVessel[] | undefined>(undefined)
  const [map, setMap] = useState<L.Map | null>(null)
  const { selectedVesselmmsi } = useVesselGuiContext()
  const { clientHandler, myDateTime} = useAppContext()

  const { selectedVesselPath } = useVesselGuiContext()
  const [streamManager] = useState(new StreamManager(clientHandler, setAllVessels, setMonitoredVessels))
  const streamStarted = useRef(false)

  useEffect(() => {
    if (!streamStarted.current) {
      streamManager.startSimpleVesselFetching()
      streamStarted.current = true
    }
  }, [])

  useEffect(() => {
    streamManager.syncMyDatetime(myDateTime)
  }, [myDateTime, streamManager])

  useEffect(() => {
    streamManager.syncAllVessels(allVessels)
  }, [allVessels, streamManager])

  useEffect(() => {
    streamManager.syncMonitoredVessels(monitoredVessels)
  }, [monitoredVessels, streamManager])

  function zoomToVessel(vessel: IMonitoredVessel) {
    const simpleVessel = allVessels?.filter((v) => v.mmsi === vessel.mmsi)[0]
    if (!simpleVessel) {
      return
    }

    if (map !== null) {
      map.setView([simpleVessel.location.point.lat, simpleVessel.location.point.lon], 13)
    }
  }

  function manageTimelineChange(index: number) {
    if (!selectedVesselPath) {
      console.error("timeline change without any path information")
      return
    }
    console.log(selectedVesselPath[index])

  }

  return (
    <div className="relative h-screen">
      <div className="absolute z-20 w-full">
        <Navbar></Navbar>
      </div>
      <div id="toolbar-container" className="absolute z-10 w-fit top-10 left-5">
        {map !== null && <Toolbar map={map} onMonitoringAreaChange={streamManager.onMonitoringZoneChange} />}
      </div>

      <div id="monitoring-menu-container" className="absolute max-w-96 max-h-98 top-10 right-5 z-10">
        {monitoredVessels && (
          <MonitoringMenu monitoredVessels={monitoredVessels}>
            {monitoredVessels.map((vessel: IMonitoredVessel) => {
              return (
                <MonitoringMenuRow
                  key={vessel.mmsi}
                  monitoredVessel={vessel}
                  isSelected={selectedVesselmmsi === vessel.mmsi}
                  zoomToCallback={zoomToVessel}
                ></MonitoringMenuRow>
              )
            })}
          </MonitoringMenu>
        )}
      </div>

      <div className="h-screen w-screen absolute top-0 left-0 z-0">
        <LMap setMapRef={setMap}>
          {allVessels && allVessels.length > 0 ? <VesselMap vessels={allVessels} /> : <></>}
        </LMap>
      </div>
      {selectedVesselPath && 
        <>
          <div id="timeline-container" className="absolute bottom-5 transform z-10 w-full">
            <TimeLine onChange={manageTimelineChange} timestamps={selectedVesselPath.map((loc) => loc.timestamp)}></TimeLine>
          </div>
          {map && 
            <Path map={map} path={selectedVesselPath}></Path>
          }
        </>
      }
    </div>
  )
}
