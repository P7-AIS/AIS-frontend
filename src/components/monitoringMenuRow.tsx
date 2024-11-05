import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { IMonitoredVessel } from '../models/monitoredVessel'

interface IMonitoringMenuRowProps {
  monitoredVessel: IMonitoredVessel
  zoomToCallback: (vessel: IMonitoredVessel) => void
}

export default function MonitoringMenuRow({ monitoredVessel, zoomToCallback }: IMonitoringMenuRowProps) {
  const { selectedVesselmmsi, setSelectedVesselmmsi } = useVesselGuiContext()

  function handleRowSelect() {
    setSelectedVesselmmsi((prevMmsi) => {
      if (prevMmsi === monitoredVessel.mmsi) return undefined
      return monitoredVessel.mmsi
    })
  }

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setSelectedVesselmmsi(monitoredVessel.mmsi)
    zoomToCallback(monitoredVessel)
  }
  return (
    <div
      className={`${selectedVesselmmsi === monitoredVessel.mmsi && 'font-bold'} grid grid-cols-4 gap-4 items-center hover:cursor-pointer text-sm`}
      onClick={handleRowSelect}
    >
      <p className="text-left font-mono">{monitoredVessel.mmsi}</p>
      <p className="text-right font-mono">{(Math.round(monitoredVessel.trustworthiness * 1000) / 10).toFixed(2)}%</p>
      <p title={monitoredVessel.reason} className="text-left truncate">
        {monitoredVessel.reason}
      </p>

      {selectedVesselmmsi === monitoredVessel.mmsi && (
        <button className="blue-badge" onClick={handleClick}>
          Zoom
        </button>
      )}

      {selectedVesselmmsi !== monitoredVessel.mmsi && (
        <div className="grey-badge text-center hover:cursor-default">Zoom</div>
      )}
    </div>
  )
}
