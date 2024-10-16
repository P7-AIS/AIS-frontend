import { IDetailedVessel } from '../models/detailedVessel';

interface IPopupProps {
	vessel: IDetailedVessel;
}

export default function Popup({ vessel }: IPopupProps) {
	return (
		<div>
			<h2>ID: {vessel.id}</h2>
			<p>Name: {vessel.name}</p>
			<p>Callsign: {vessel.callSign}</p>
			<p>Length: {vessel.length}</p>
			<p>pos fixing device: {vessel.positionFixingDevice}</p>
			<p>MMSI: {vessel.mmsi}</p>
		</div>
	);
}
