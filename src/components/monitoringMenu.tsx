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
      <div className={`flex flex-row justify-between items-center gap-4`}>
        <h1 className="text-lg font-bold">Monitored vessels</h1>
        <div className="flex gap-1">
          <p className="text-sm rounded-md bg-gray-800 px-2 py-1">
            {monitoredVessels.length} {monitoredVessels.length == 1 ? 'vessel' : 'vessels'}
          </p>
          <button title="Show/hide list of monitored vessels" onClick={() => setIsCollapsed(!isCollapsed)} className="">
            {isCollapsed ? <ChevronSVG rotate={180} /> : <ChevronSVG />}
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <>
          <div id="title-row" className="px-2 pr-6 py-2 flex flex-row gap-4 font-medium">
            <p className="w-20">MMSI</p>
            <p className="w-12">Trust</p>
            <p className="w-[200px]">Reason</p>
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
    </div>
  )
}
