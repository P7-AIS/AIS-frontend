import { useVesselGuiContext } from '../contexts/vesselGuiContext';
import { useState } from 'react';
import { ISimpleVessel } from '../models/simpleVessel';
import { IMonitoredVessel } from '../models/monitoredVessel';
import Vessel from '../components/vessel';

export default function VesselMapPage() {
	const [allVessels, setAllVessels] = useState<ISimpleVessel[] | undefined>(
		undefined
	);
	const [monitoredVessels, setMonitoredVessels] = useState<
		IMonitoredVessel[] | undefined
	>(undefined);

	const { pathHistory } = useVesselGuiContext();

	const vessel: ISimpleVessel = {
		vesselId: 123,
		location: {
			heading: 10,
			timestamp: new Date(),
			point: {
				lat: 50,
				lon: 10
			}
		}
	};

	return (
		<>
			<h1>Here is the page {pathHistory ? 'true' : 'false'}</h1>
			<Vessel isMonitored={false} vessel={vessel}></Vessel>
		</>
	);
}
