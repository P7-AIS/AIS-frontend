import { ISimpleVessel } from '../models/simpleVessel'
import { useEffect, useState } from 'react'
import { ILocation } from '../models/location'
import { IDetailedVessel } from '../models/detailedVessel'
import Popup from './popup'
import Path from './path'
import { Marker } from 'react-leaflet'
import { useAppContext } from '../contexts/appcontext'
import VesselMarker from './vesselMarker'
import React from 'react'

interface IVesselProps {
  vessel: ISimpleVessel
  isMonitored: boolean
}

const Vessel = React.memo(
  ({ vessel, isMonitored }: IVesselProps) => {
    const [history, setHistory] = useState<ILocation[] | undefined>(undefined)
    const [vesselDetail, setVesselDetail] = useState<IDetailedVessel | undefined>(undefined)
    const { clientHandler } = useAppContext()

    return (
      <>
        <VesselMarker vessel={vessel} popup={vesselDetail ? <Popup vessel={vesselDetail} /> : <></>}></VesselMarker>
      </>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.vessel.location.point.lat === nextProps.vessel.location.point.lat &&
      prevProps.vessel.location.point.lon === nextProps.vessel.location.point.lon &&
      prevProps.vessel.location.heading === nextProps.vessel.location.heading
    )
  }
)

export default Vessel
