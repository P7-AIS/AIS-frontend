import { IDetailedVessel } from '../models/detailedVessel'

interface IPopupProps {
  vessel: IDetailedVessel
}

export default function Popup({ vessel }: IPopupProps) {
  return (
    <div>
      <p>Name: {vessel.name}</p>
      <p>MMSI: {vessel.mmsi}</p>
      <p>IMO: {vessel.imo}</p>
      <p>Ship type: {vessel.shipType}</p>
      <p>Width: {vessel.width}</p>
      <p>Length: {vessel.length}</p>
      <p>Callsign: {vessel.callSign}</p>
      <p>Pos fixing device: {vessel.positionFixingDevice}</p>
    </div>
  )
}
