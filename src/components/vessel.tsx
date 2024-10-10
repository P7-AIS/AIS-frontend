import { ISimpleVessel } from '../models/simpleVessel';
import { useState } from 'react';
import { ILocation } from '../models/location';
import { IDetailedVessel } from '../models/detailedVessel';
import Popup from './popup';
import Timeline from './timeline';
import Path from './path';

interface IVesselProps {
	vessel: ISimpleVessel | IDetailedVessel;
	isMonitored: boolean;
}

export default function Vessel({ vessel, isMonitored }: IVesselProps) {
	const [history, setHistory] = useState<ILocation[] | undefined>(undefined);
	const [vesselDetail, setVesselDetail] = useState<IDetailedVessel | undefined>(
		undefined
	);

	function vesselTimestamps() {
		//fetch history
		return [];
	}

	return (
		<>
			<h1>Vessel</h1>
			{vesselDetail && <Popup vessel={vesselDetail}></Popup>}
			<Timeline timestamps={vesselTimestamps()}></Timeline>
			{history && <Path history={history}></Path>}
		</>
	);
}
