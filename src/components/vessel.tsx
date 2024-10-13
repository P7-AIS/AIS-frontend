import { ISimpleVessel } from '../models/simpleVessel'
import { useEffect, useState } from 'react'
import { ILocation } from '../models/location'
import { IDetailedVessel } from '../models/detailedVessel'
import Popup from './popup'
import Timeline from './timeline'
import Path from './path'
import { useAppContext } from '../contexts/appcontext'

interface IVesselProps {
  vessel: ISimpleVessel | IDetailedVessel
  isMonitored: boolean
}

export default function Vessel({ vessel, isMonitored }: IVesselProps) {
  const [history, setHistory] = useState<ILocation[] | undefined>(undefined)
  const [vesselDetail, setVesselDetail] = useState<IDetailedVessel | undefined>(undefined)
  const { clientHandler } = useAppContext()

  function vesselTimestamps() {
    //fetch history
    return []
  }
  async function popupClick() {
    const response = await clientHandler.GetVesselInfo({ mmsi: 12345678, timeStamp: 0 })

    setVesselDetail(response)

    console.log(response)
  }

  useEffect(() => {
    const request = {
      selection: [],
      startTime: 1728645348194,
      timeSpeed: 0,
    }

    const stream = clientHandler.StartStreaming(request)

    stream.subscribe((data) => {
      console.log(data)
    })
  }, [clientHandler])

  return (
    <>
      <h1>Vessel component</h1>
      <button onClick={popupClick}>Shop popup</button>
      {vesselDetail && <Popup vessel={vesselDetail}></Popup>}
      <Timeline timestamps={vesselTimestamps()}></Timeline>
      {history && <Path history={history}></Path>}
    </>
  )
}
