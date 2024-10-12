import { ISimpleVessel } from '../models/simpleVessel'
import { useEffect, useState } from 'react'
import { ILocation } from '../models/location'
import { IDetailedVessel } from '../models/detailedVessel'
import Popup from './popup'
import Timeline from './timeline'
import Path from './path'
import GRPCClient from '../GRPCClient'
import { StreamingRequest, StreamingResponse, VesselInfoRequest } from '../../proto/AIS-protobuf/ais'

interface IVesselProps {
  vessel: ISimpleVessel | IDetailedVessel
  isMonitored: boolean
}

export default function Vessel({ vessel, isMonitored }: IVesselProps) {
  const [history, setHistory] = useState<ILocation[] | undefined>(undefined)
  const [vesselDetail, setVesselDetail] = useState<IDetailedVessel | undefined>(undefined)

  function vesselTimestamps() {
    //fetch history
    return []
  }
  async function popupClick() {
    const request: VesselInfoRequest = {
      mmsi: 12345678,
      timestamp: 0,
    }

    const response = await GRPCClient.GetVesselInfo(request)

    const details: IDetailedVessel = {
      id: response.mmsi,
      name: response.name,
      mmsi: response.mmsi,
    }

    setVesselDetail(details)

    console.log(response)
  }

  useEffect(() => {
    const request: StreamingRequest = {
      selectedArea: [],
      startTime: 1728645348194,
      timeSpeed: 0,
    }

    const stream = GRPCClient.StartStreaming(request)

    stream.subscribe((data) => {
      console.log(data)
    })
  }, [])

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
