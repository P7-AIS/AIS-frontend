import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { IMonitoredVessel } from '../models/monitoredVessel'
import EyeSVG from '../svgs/eyeSVG'

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
    <span className={`${selectedVesselmmsi === monitoredVessel.mmsi && 'font-bold'} grid grid-cols-4 gap-4`}>
      <p className="text-left font-mono">{monitoredVessel.mmsi}</p>
      <p className="text-right font-mono">{(Math.round(monitoredVessel.trustworthiness * 1000) / 10).toFixed(2)}%</p>
      <p title={monitoredVessel.reason} className="text-left text-ellipsis">
        {monitoredVessel.reason}
      </p>
      <button
        title="Go to vessel"
        className="flex items-center justify-center transition-all hover:scale-110"
        onClick={handleClick}
      >
        <EyeSVG />
      </button>
    </span>
  )
}
