import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { IMonitoredVessel } from '../models/monitoredVessel'

interface IMonitoringMenuRowProps {
  monitoredVessel: IMonitoredVessel
  zoomToCallback: (vessel: IMonitoredVessel) => void
}

export default function MonitoringMenuRow({ monitoredVessel, zoomToCallback }: IMonitoringMenuRowProps) {
  const { selectedVesselmmsi, setSelectedVesselmmsi, setPathIsShown } = useVesselGuiContext()

  function handleRowSelect() {
    setSelectedVesselmmsi((prevMmsi) => {
      if (prevMmsi === monitoredVessel.mmsi) return undefined
      return monitoredVessel.mmsi
    })
    if (selectedVesselmmsi === monitoredVessel.mmsi) {
      setPathIsShown(false)
    }
  }

  function convertToReasons(reason: string | undefined): string[] {
    const separator = ' | '
    if (reason === undefined || reason.length === 0) {
      return []
    }
    return reason.split(separator)
  }

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setSelectedVesselmmsi(monitoredVessel.mmsi)
    zoomToCallback(monitoredVessel)
  }

  return (
    <div
      className={`${selectedVesselmmsi === monitoredVessel.mmsi && 'font-bold'} flex flex-row gap-4 items-center hover:cursor-pointer text-sm`}
      onClick={handleRowSelect}
    >
      <p className="font-mono w-20">{monitoredVessel.mmsi}</p>
      <p className="font-mono w-12">{(Math.round(monitoredVessel.trustworthiness * 1000) / 10).toFixed(2)}%</p>
      {selectedVesselmmsi === monitoredVessel.mmsi ? (
        <div className="truncate w-[200px] flex flex-row gap-1 flex-wrap">
          {convertToReasons(monitoredVessel.reason).map((reason, index) => (
            <span key={index} className="block bg-white bg-opacity-10 rounded-md px-2 py-1 font-normal text-sm">
              {reason}
            </span>
          ))}
        </div>
      ) : (
        <p title={monitoredVessel.reason} className="w-[200px] truncate">
          {monitoredVessel.reason}
        </p>
      )}

      {selectedVesselmmsi === monitoredVessel.mmsi ? (
        <button className="blue-badge" onClick={handleClick}>
          Zoom
        </button>
      ) : (
        <div className="grey-badge text-center hover:cursor-default">Zoom</div>
      )}
    </div>
  )
}
