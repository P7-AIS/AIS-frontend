import { useEffect, useState } from 'react'
import { useAppContext } from '../contexts/appcontext'
import { IDetailedVessel } from '../models/detailedVessel'

interface IPopupProps {
  mmsi: number
}

export default function Popup({ mmsi }: IPopupProps) {
  const { clientHandler, myDateTime } = useAppContext()
  const [vesselDetails, setVesselDetails] = useState<IDetailedVessel | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      const details = await clientHandler.getVesselInfo({ mmsi, timestamp: myDateTime.getTime() })
      setVesselDetails(details)
    }

    fetchDetails()
    setLoading(false)
  }, [])

  return (
    <div id="popup-container" className="h-[300px] w-[180px]">
      {loading ? (
        <p>Loading...</p>
      ) : (
        vesselDetails && (
          <>
            <p>Name: {vesselDetails.name}</p>
            <p>MMSI: {vesselDetails.mmsi}</p>
            <p>IMO: {vesselDetails.imo}</p>
            <p>Ship type: {vesselDetails.shipType}</p>
            <p>Width: {vesselDetails.width}</p>
            <p>Length: {vesselDetails.length}</p>
            <p>Callsign: {vesselDetails.callSign}</p>
            <p>Pos fixing device: {vesselDetails.positionFixingDevice}</p>
          </>
        )
      )}
    </div>
  )
}
