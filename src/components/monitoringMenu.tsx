import { IMonitoredVessel } from '../models/monitoredVessel'
import { useState } from 'react'
import MonitoringMenuRow from './monitoringMenuRow'
import ChevronSVG from '../svgs/chevronSVG'

interface IMonitoringMenuProps {
  monitoredVessels: IMonitoredVessel[]
  zoomToVessel: (vessel: IMonitoredVessel) => void
}

export default function MonitoringMenu({ monitoredVessels, zoomToVessel }: IMonitoringMenuProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const sortedMonitoredVessels = monitoredVessels.sort((a, b) => a.trustworthiness - b.trustworthiness)

  return (
    <div className="flex flex-col h-full rounded-lg bg-gray-200 px-2 shadow-xl">
      <div className={`flex flex-row justify-between items-center ${!isCollapsed && 'border-b-2'} gap-4 p-2`}>
        <h1 className="text-xl font-bold">Monitored vessels</h1>
        <p className="text-sm rounded-md bg-gray-300 py-1 px-2">
          {monitoredVessels.length} {monitoredVessels.length == 1 ? 'vessel' : 'vessels'}
        </p>
      </div>
      {!isCollapsed && (
        <>
          <div id="title-row" className="px-3 pr-6 pb-1 grid grid-cols-4 gap-4 font-medium">
            <p className="text-left">MMSI</p>
            <p className="text-right">Trust</p>
            <p className="text-left">Reason</p>
            <p className="text-center">Follow</p>
          </div>
          <div id="rows-container" className="max-h-[50vh] overflow-y-auto divide-y rounded-md">
            {sortedMonitoredVessels.map((vessel, index) => (
              <div className="py-2 px-3 odd:bg-gray-100 even:bg-gray-200" key={index}>
                <MonitoringMenuRow
                  key={vessel.mmsi}
                  monitoredVessel={vessel}
                  zoomToCallback={zoomToVessel}
                />
              </div>
            ))}
          </div>
        </>
      )}
      <button
        title="Show/hide list of monitored vessels"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex flex-cols items-center justify-center bottom-0"
      >
        {isCollapsed ? <ChevronSVG /> : <ChevronSVG rotate={180} />}
      </button>
    </div>
  )
}
