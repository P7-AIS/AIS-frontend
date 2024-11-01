import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { IMonitoredVessel } from '../models/monitoredVessel'

interface IMonitoringMenuRowProps {
  monitoredVessel: IMonitoredVessel
  zoomToCallback: (vessel: IMonitoredVessel) => void
}

export default function MonitoringMenuRow({ monitoredVessel, zoomToCallback }: IMonitoringMenuRowProps) {
  const { selectedVesselmmsi, setSelectedVesselmmsi } = useVesselGuiContext()
  function handleClick() {
    setSelectedVesselmmsi(monitoredVessel.mmsi)
    zoomToCallback(monitoredVessel)
  }
  return (
    <button
      className={`${selectedVesselmmsi === monitoredVessel.mmsi && 'font-bold'} grid grid-cols-4 gap-4 items-center`}
      onClick={() => setSelectedVesselmmsi(monitoredVessel.mmsi)}>
      <p className="text-left font-mono">{monitoredVessel.mmsi}</p>
      <p className="text-right font-mono">{(Math.round(monitoredVessel.trustworthiness * 1000) / 10).toFixed(2)}%</p>
      <p title={monitoredVessel.reason} className="text-left truncate">
        {monitoredVessel.reason}
      </p>
      <button className='small-blue-btn' onClick={handleClick}>
        Zoom
      </button>
    </button>
  )
}
