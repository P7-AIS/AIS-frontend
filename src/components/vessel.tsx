import { ISimpleVessel } from '../models/simpleVessel'
import { useEffect, useState } from 'react'
import { ILocation } from '../models/location'
import { IDetailedVessel } from '../models/detailedVessel'
import Popup from './popup'
import Path from './path'
import { Marker } from 'react-leaflet'
import { useAppContext } from '../contexts/appcontext'
import VesselMarker from './vesselMarker'

interface IVesselProps {
  vessel: ISimpleVessel | IDetailedVessel
  isMonitored: boolean
}

export default function Vessel({ vessel, isMonitored }: IVesselProps) {
  const [history, setHistory] = useState<ILocation[] | undefined>(undefined)
  const [vesselDetail, setVesselDetail] = useState<IDetailedVessel | undefined>(undefined)
  const { clientHandler } = useAppContext()


  return (
    <>
      <VesselMarker vessel={vessel} popup={
        vesselDetail ? <Popup vessel={vesselDetail} /> : <></>
      }>
      </VesselMarker>
    </>
  )
}
