import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { useState, useEffect, useRef } from 'react'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import VesselMap from '../components/vesselMap'
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import L from 'leaflet'
import MonitoringMenu from '../components/monitoringMenu'
import MonitoringMenuRow from '../components/monitoringMenuRow'
import Toolbar from '../components/toolbar'
import { useAppContext } from '../contexts/appcontext'
import StreamManager from '../implementations/StreamManager'

export default function VesselMapPage() {
  const [allVessels, setAllVessels] = useState<ISimpleVessel[]>([])
  const [monitoredVessels, setMonitoredVessels] = useState<IMonitoredVessel[]>([])
  const [map, setMap] = useState<L.Map | null>(null)
  const { selectedVesselmmsi } = useVesselGuiContext()
  const { clientHandler, myClockSpeed, setMyClockSpeed, myDateTime, setMyDateTime } = useAppContext()

  const { pathHistory } = useVesselGuiContext()
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

  return (
    <div className="relative">
      <div id="toolbar-container" className="absolute z-10 w-fit top-5 left-5">
        {map !== null && <Toolbar map={map} onMonitoringAreaChange={streamManager.onMonitoringZoneChange} />}
      </div>

      <div id="monitoring-menu-container" className="absolute max-w-96 max-h-98 top-5 right-5 z-10">
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
        <VesselMap setMapRef={setMap} simpleVessels={allVessels} monitoredVessels={monitoredVessels} />
      </div>
      {/* <div id="timeline-container" className="absolute end-0 left-0 z-10">
        <TimeLine timestamps={[new Date(123456), new Date(54123), new Date(871263)]}></TimeLine>
      </div> */}
    </div>
  )
}
