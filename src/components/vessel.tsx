import { ISimpleVessel } from '../models/simpleVessel'
import { useState } from 'react'
import { ILocation } from '../models/location'
import VesselMarker from './vesselMarker'
import React from 'react'

interface IVesselProps {
  vessel: ISimpleVessel
}

const Vessel = React.memo(
  ({ vessel }: IVesselProps) => {
    const [history, setHistory] = useState<ILocation[] | undefined>(undefined)

    return (
      <>
        <VesselMarker vessel={vessel} />
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
