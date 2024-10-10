import { IDetailedVessel } from '../models/detailedVessel';

interface IPopupProps {
	vessel: IDetailedVessel;
}

export default function Popup({ vessel }: IPopupProps) {
	return <h1>popup</h1>;
}
