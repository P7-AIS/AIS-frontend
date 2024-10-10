import { IMonitoredVessel } from '../models/monitoredVessel';
import { useState } from 'react';
import MonitoringMenuRow from './monitoringMenuRow';

interface IMonitoringMenuProps {
	monitoredVessels: IMonitoredVessel[];
	children: React.ReactElement<typeof MonitoringMenuRow>[];
}

export default function MonitoringMenu({
	monitoredVessels,
	children
}: IMonitoringMenuProps) {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

	return (
		<>
			<h1>Vessel menu</h1>
			{children}
		</>
	);
}
