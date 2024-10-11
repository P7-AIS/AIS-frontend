import { ISimpleVessel } from '../models/simpleVessel';
import { useState } from 'react';
import { ILocation } from '../models/location';
import { IDetailedVessel } from '../models/detailedVessel';
import Popup from './popup';
import Timeline from './timeline';
import Path from './path';
import { AISServiceClient } from '../../proto/ais.client';
import { VesselInfoRequest } from '../../proto/ais';
import { GrpcWebClientBase } from 'grpc-web';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

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
	async function popupClick() {
		if (vesselDetail) {
			setVesselDetail(undefined);
			return;
		}

		const transport = new GrpcWebFetchTransport({
			baseUrl: 'http://127.0.0.1:50000'
		});
		const client = new AISServiceClient(transport);
		const request: VesselInfoRequest = {
			mmsi: 123n,
			timestamp: 12312n
		};

		const response = client.getVesselInfo(request);
		console.log(response);
	}

	return (
		<>
			<h1>Vessel component</h1>
			<button onClick={popupClick}>Shop popup</button>
			{vesselDetail && <Popup vessel={vesselDetail}></Popup>}
			<Timeline timestamps={vesselTimestamps()}></Timeline>
			{history && <Path history={history}></Path>}
		</>
	);
}
