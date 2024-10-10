import { IMonitoredVessel } from '../models/monitoredVessel';

interface IMonitoringMenuRowProps {
	isSelected: boolean;
	monitoredVessel: IMonitoredVessel;
}

export default function MonitoringMenuRow({
	isSelected,
	monitoredVessel
}: IMonitoringMenuRowProps) {
	return <h1>Monitoring Menu Row</h1>;
}
