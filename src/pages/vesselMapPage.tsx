import { useVesselGuiContext } from '../contexts/vesselGuiContext';
import { useState } from 'react';
import { ISimpleVessel } from '../models/simpleVessel';
import { IMonitoredVessel } from '../models/monitoredVessel';

export default function VesselMapPage() {
	const [allVessels, setAllVessels] = useState<ISimpleVessel[] | undefined>(
		undefined
	);
	const [monitoredVessels, setMonitoredVessels] = useState<
		IMonitoredVessel[] | undefined
	>(undefined);

	const { pathHistory } = useVesselGuiContext();
	return <h1>test {pathHistory ? 'true' : 'false'}</h1>;
}
