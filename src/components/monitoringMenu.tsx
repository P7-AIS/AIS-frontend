import { IMonitoredVessel } from '../models/monitoredVessel'
import { useState } from 'react'
import MonitoringMenuRow from './monitoringMenuRow'

interface IMonitoringMenuProps {
  monitoredVessels: IMonitoredVessel[]
  children: React.ReactElement<typeof MonitoringMenuRow>[]
}

export default function MonitoringMenu({ monitoredVessels, children }: IMonitoringMenuProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

  return (
    <div className="flex flex-col h-full rounded-lg border-2 bg-neutral_2 px-2">
      <div className={`flex flex-row justify-between items-center ${!isCollapsed && 'border-b-2'} gap-4 p-2`}>
        <h1 className="text-xl font-bold">Monitoring overview</h1>
        <p className="text-sm">{monitoredVessels.length} ships</p>
      </div>
      {!isCollapsed && (
        <div id="rows-container" className="max-h-96 overflow-y-auto divide-y">
          {children.map((child, index) => (
            <div className="py-1" key={index}>
              {child}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex flex-cols items-center justify-center bottom-0"
      >
        {isCollapsed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-chevron-down"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-chevron-up"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
