import { useVesselGuiContext } from '../contexts/vesselGuiContext';
import { useState, useEffect, useRef } from 'react';
import { ISimpleVessel } from '../models/simpleVessel';
import { IMonitoredVessel } from '../models/monitoredVessel';
import LMap from '../components/map';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import L from 'leaflet';
import MonitoringMenu from '../components/monitoringMenu';
import MonitoringMenuRow from '../components/monitoringMenuRow';
import Toolbar from '../components/toolbar';
import VesselMap from '../components/vesselMap';
import { useAppContext } from '../contexts/appcontext';
import TimeLine from '../components/timeline';
import StreamManager from '../implementations/StreamManager';
import Navbar from '../components/navbar';
import Path from '../components/path';

export default function VesselMapPage() {
  const [allVessels, setAllVessels] = useState<ISimpleVessel[] | undefined>(undefined);
  const [monitoredVessels, setMonitoredVessels] = useState<IMonitoredVessel[] | undefined>(undefined);
  const [map, setMap] = useState<L.Map | null>(null);
  const { selectedVesselmmsi, selectedVesselPath } = useVesselGuiContext();
  const { clientHandler, myDateTimeRef } = useAppContext();

  // Use a ref to store the StreamManager instance
  const streamManagerRef = useRef(new StreamManager(clientHandler, setAllVessels, setMonitoredVessels, myDateTimeRef));
  const streamStarted = useRef(false);

  useEffect(() => {
    if (!streamStarted.current) {
      streamManagerRef.current.startSimpleVesselFetching();
      streamStarted.current = true;
    }
    return () => {
      streamManagerRef.current.stopSimpleVesselFetching(); // Stop fetching on unmount
    };
  }, []);

  useEffect(() => {
    streamManagerRef.current.syncAllVessels(allVessels);
  }, [allVessels]);

  useEffect(() => {
    streamManagerRef.current.syncMonitoredVessels(monitoredVessels);
  }, [monitoredVessels]);

  function zoomToVessel(vessel: IMonitoredVessel) {
    const simpleVessel = allVessels?.find(v => v.mmsi === vessel.mmsi);
    if (simpleVessel && map) {
      map.setView([simpleVessel.location.point.lat, simpleVessel.location.point.lon], 13);
    }
  }

  function manageTimelineChange(index: number) {
    if (!selectedVesselPath) {
      console.error("timeline change without any path information");
      return;
    }
    console.log(selectedVesselPath[index]);
  }

  return (
    <div className="relative h-screen">
      <div className="absolute z-20 w-full">
        <Navbar />
      </div>
      <div id="toolbar-container" className="absolute z-10 w-fit top-10 left-5">
        {map && <Toolbar map={map} onMonitoringAreaChange={streamManagerRef.current.onMonitoringZoneChange} />}
      </div>

      <div id="monitoring-menu-container" className="absolute max-w-96 max-h-98 top-10 right-5 z-10">
        {monitoredVessels && (
          <MonitoringMenu monitoredVessels={monitoredVessels}>
            {monitoredVessels.map((vessel: IMonitoredVessel) => (
              <MonitoringMenuRow
                key={vessel.mmsi}
                monitoredVessel={vessel}
                isSelected={selectedVesselmmsi === vessel.mmsi}
                zoomToCallback={zoomToVessel}
              />
            ))}
          </MonitoringMenu>
        )}
      </div>

      <div className="h-screen w-screen absolute top-0 left-0 z-0">
        <LMap setMapRef={setMap}>
          {allVessels && allVessels.length > 0 ? <VesselMap vessels={allVessels} /> : null}
        </LMap>
      </div>

      {selectedVesselPath && (
        <>
          <div id="timeline-container" className="absolute bottom-5 transform z-10 w-full">
            <TimeLine onChange={manageTimelineChange} timestamps={selectedVesselPath.map((loc) => loc.timestamp)} />
          </div>
          {map && <Path map={map} path={selectedVesselPath} />}
        </>
      )}
    </div>
  );
}
