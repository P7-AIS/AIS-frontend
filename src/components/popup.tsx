import { IDetailedVessel } from '../models/detailedVessel'

export default function Popup({ vesselDetails }: { vesselDetails: IDetailedVessel }) {
  return (
    <div className="h-[300px] w-[180px]">
      <p>Name: {vesselDetails.name}</p>
      <p>MMSI: {vesselDetails.mmsi}</p>
      <p>IMO: {vesselDetails.imo}</p>
      <p>Ship type: {vesselDetails.shipType}</p>
      <p>Width: {vesselDetails.width}</p>
      <p>Length: {vesselDetails.length}</p>
      <p>Callsign: {vesselDetails.callSign}</p>
      <p>Pos fixing device: {vesselDetails.positionFixingDevice}</p>
    </div>
  )
}
