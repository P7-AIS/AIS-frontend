import { IMonitoredVessel } from '../models/monitoredVessel'
import { useState } from 'react'
import MonitoringMenuRow from './monitoringMenuRow'
import ChevronSVG from '../svgs/chevronSVG'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'

interface IMonitoringMenuProps {
  monitoredVessels: IMonitoredVessel[]
  zoomToVessel: (vessel: IMonitoredVessel) => void
}

export default function MonitoringMenu({ monitoredVessels, zoomToVessel }: IMonitoringMenuProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const sortedMonitoredVessels = monitoredVessels.sort((a, b) => a.trustworthiness - b.trustworthiness)
  const { selectedVesselmmsi } = useVesselGuiContext()

  return (
    <div className="flex flex-col h-full rounded-lg bg-gray-700 text-white p-4">
      <div className={`flex flex-row justify-between items-center gap-4 pb-2`}>
        <h1 className="text-lg font-bold pb-2">Monitored vessels</h1>
        <p className="text-sm rounded-md bg-gray-800 px-2 py-1">
          {monitoredVessels.length} {monitoredVessels.length == 1 ? 'vessel' : 'vessels'}
        </p>
      </div>
      {!isCollapsed && (
        <>
          <div id="title-row" className="px-2 pr-6 pb-2 grid grid-cols-4 gap-4 font-medium">
            <p className="text-left">MMSI</p>
            <p className="text-right">Trust</p>
            <p className="text-left">Reason</p>
            <p className="text-center">Find vessel</p>
          </div>
          <div id="rows-container" className="max-h-[50vh] overflow-y-auto divide-y rounded-md">
            {sortedMonitoredVessels.map((vessel, index) => (
              <div
                className={`py-1 px-2 ${vessel.mmsi === selectedVesselmmsi ? 'bg-blue-800' : 'odd:bg-gray-600 even:bg-gray-700'} rounded-lg border-none mr-2 
                `}
                key={index}
              >
                <MonitoringMenuRow key={vessel.mmsi} monitoredVessel={vessel} zoomToCallback={zoomToVessel} />
              </div>
            ))}
          </div>
        </>
      )}
      <button
        title="Show/hide list of monitored vessels"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex flex-cols items-center justify-center bottom-0 mt-4"
      >
        {isCollapsed ? <ChevronSVG rotate={180} /> : <ChevronSVG />}
      </button>
    </div>
  )
}
