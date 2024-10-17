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
		<div className="flex flex-col h-full rounded-lg border-neural_3 border-2 bg-neutral_2 px-2">
			<div className="flex flex-row justify-between items-center border-b-2 gap-4 p-2">
				<h1 className="text-xl font-bold">Monitoring overview</h1>
				<p className="text-sm">
					{monitoredVessels.length} ships
				</p>
			</div>
			{!isCollapsed &&
				<div id="rows-container" className="max-h-96 overflow-y-auto divide-y">
					{children.map((child, index) => (
						<div className="py-1" key={index}>{child}</div>
					))}
				</div>
			}
			<button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full flex flex-cols items-center justify-center bottom-0">
				{isCollapsed
					? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down" viewBox="0 0 16 16">
						<path d="M3.204 5h9.592L8 10.481zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659" />
					</svg>
					: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-up" viewBox="0 0 16 16">
						<path d="M3.204 11h9.592L8 5.519zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659" />
					</svg>
				}
			</button>
		</div>
	);
}