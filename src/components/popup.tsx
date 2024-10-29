import { useEffect, useState } from 'react'
import { useAppContext } from '../contexts/appcontext'
import { IDetailedVessel } from '../models/detailedVessel'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'

interface IPopupProps {
  mmsi: number
  markerRef: L.Marker | null
}

export default function Popup({ mmsi, markerRef }: IPopupProps) {
  const { clientHandler, myDateTime } = useAppContext()
  const  {setSelectedVesselmmsi, selectedVesselPath, setSelectedVesselPath } = useVesselGuiContext()
  const [vesselDetails, setVesselDetails] = useState<IDetailedVessel | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [pathDuration, setPathDuration] = useState<number>(1)

  if (markerRef) {
    markerRef.getPopup()?.on("remove", function() {
      setSelectedVesselmmsi(undefined)
      setVesselDetails(undefined)
      setLoading(true)
    })
  }

  useEffect(() => {
    const fetchDetails = async () => {
      const details = await clientHandler.getVesselInfo({ mmsi, timestamp: myDateTime.getTime() })
      setVesselDetails(details)
    }

    fetchDetails()
    setLoading(false)
  }, [])

  async function getVesselPath() {
    const res = await clientHandler.getVesselPath({mmsi: mmsi, endtime: myDateTime.getTime()/1000, starttime: myDateTime.getTime()/1000-(pathDuration*60*60)}) //time is in seconds
    setSelectedVesselPath(res.pathHistory.locations) 
  }

  function handleDurationChange(val: string) {
    try {
      const parsed = parseFloat(val)
      setPathDuration(parsed)
    } catch(e) {
      console.error(e)
      setPathDuration(1)
    }
  }
  
  return (
    <div id="popup-container" className="h-[350px] w-[180px]">
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
            <div className="flex flex-row items-center gap-2">
              <div className="m-0 font-bold">Path Duration(h)</div>
              <input className="w-16 h-8 border-2 border-neutral_2 rounded-md text-right" type="number" placeholder="Path duration  Hours" value={pathDuration} onChange={(e) => handleDurationChange(e.target.value)}></input>
            </div>
            <button className="bg-blue-600 hover:bg-blue-400 p-2 rounded-md text-white"  onClick={getVesselPath}>Show Path</button>
          </>
        )
      )}
    </div>
  )
}
