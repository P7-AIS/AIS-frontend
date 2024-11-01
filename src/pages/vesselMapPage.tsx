import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { useState, useEffect, useRef } from 'react'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MonitoringMenu from '../components/monitoringMenu'
import Toolbar from '../components/toolbar'
import { useAppContext } from '../contexts/appcontext'
import TimeLine from '../components/timeline'
import StreamManager from '../implementations/StreamManager'
import VesselMap from '../components/vesselMap'
import Navbar from '../components/navbar'
import Path from '../components/path'
import SelectionAreaOverlay from '../components/selectionAreaOverlay'
import VesselMarkerOverlay from '../components/vesselMarkerOverlay'
import PathOverlay from '../components/pathOverlay'
import VesselDetailsBox from '../components/vesselDetailsBox'

export default function VesselMapPage() {
  const [allVessels, setAllVessels] = useState<ISimpleVessel[]>([])
  const [monitoredVessels, setMonitoredVessels] = useState<IMonitoredVessel[]>([])
  const [map, setMap] = useState<L.Map | null>(null)
  const { selectedVesselmmsi, selectedVesselPath, selectionArea, setSelectionArea } = useVesselGuiContext()
  const { clientHandler, myDateTimeRef } = useAppContext()

  // Use a ref to store the StreamManager instance
  const streamManagerRef = useRef(new StreamManager(clientHandler, setAllVessels, setMonitoredVessels, myDateTimeRef))
  const streamStarted = useRef(false)

  useEffect(() => {
    if (!streamStarted.current) {
      streamManagerRef.current.startSimpleVesselFetching()
      streamStarted.current = true
    }
    return () => {
      streamManagerRef.current.stopSimpleVesselFetching() // Stop fetching on unmount
    }
  }, [])

  useEffect(() => {
    streamManagerRef.current.syncAllVessels(allVessels)
  }, [allVessels])

  useEffect(() => {
    streamManagerRef.current.syncMonitoredVessels(monitoredVessels)
  }, [monitoredVessels])

  function zoomToVessel(vessel: IMonitoredVessel) {
    const simpleVessel = allVessels?.find((v) => v.mmsi === vessel.mmsi)
    if (simpleVessel && map) {
      map.setView([simpleVessel.location.point.lat, simpleVessel.location.point.lon], 13)
    }
  }

  function manageTimelineChange(index: number) {
    if (!selectedVesselPath) {
      console.error('timeline change without any path information')
      return
    }
    // console.log(selectedVesselPath[index])
    console.log('Timelinechange: index ' + index)
  }

  return (
    <div className="relative h-screen">
      <div className="absolute z-20 w-[350px] flex flex-col top-5 left-5 gap-3">
        <Navbar />
        {map && (
          <Toolbar
            map={map}
            onMonitoringAreaChange={streamManagerRef.current.onMonitoringZoneChange}
            setSelectionArea={setSelectionArea}
          />
        )}
        {selectedVesselmmsi && <VesselDetailsBox />}
      </div>

      <div id="monitoring-menu-container" className="absolute min-w-[25vw] max-h-[75vh] top-5 right-5 z-10">
        {monitoredVessels.length !== 0 && (
          <MonitoringMenu monitoredVessels={monitoredVessels} zoomToVessel={zoomToVessel} />
        )}
      </div>

      <div className="h-screen w-screen absolute top-0 left-0 z-0">
        <VesselMap
          setMapRef={setMap}
          overlays={
            <>
              <SelectionAreaOverlay selectionArea={selectionArea} />
              <PathOverlay
                path={[
                  { point: { lat: 55, lon: 10 }, heading: 180, timestamp: new Date() },
                  { point: { lat: 56, lon: 11 }, heading: 0, timestamp: new Date('2024-10-30') },
                ]}
                idx={1}
              />
              <VesselMarkerOverlay simpleVessels={allVessels} monitoredVessels={monitoredVessels} />
            </>
          }
        />
      </div>

      {
        <>
          <div id="timeline-container" className="absolute bottom-5 transform z-10 w-full">
            {/* <TimeLine onChange={manageTimelineChange} timestamps={selectedVesselPath.map((loc) => loc.timestamp)} /> */}
            <TimeLine
              onChange={manageTimelineChange}
              timestamps={[new Date(), new Date('2024-10-30'), new Date('2024-10-29')]}
            />
          </div>
          {/* {map && <Path map={map} path={selectedVesselPath} />} */}
        </>
      }
    </div>
  )
}
