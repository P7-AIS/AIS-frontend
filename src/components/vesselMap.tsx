import L from 'leaflet'
import { useState, useEffect } from 'react'
import { useMapEvents } from 'react-leaflet'
import { ISimpleVessel } from '../models/simpleVessel'
import Vessel from './vessel'

interface IVesselMapProps {
  vessels: ISimpleVessel[]
}

export default function VesselMap({ vessels }: IVesselMapProps) {
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null)

  const map = useMapEvents({
    moveend() {
      setMapBounds(map.getBounds())
    },
    zoomend() {
      setMapBounds(map.getBounds())
    },
  })

  useEffect(() => {
    setMapBounds(map.getBounds())
  }, [map])

  const visibleVessels = vessels.filter((vessel) => {
    if (!mapBounds) return true
    const vesselLatLng = new L.LatLng(vessel.location.point.lat, vessel.location.point.lon)
    return mapBounds.contains(vesselLatLng)
  })

  return (
    <>
      {visibleVessels.map((vessel) => (
        <Vessel vessel={vessel}></Vessel>
      ))}
    </>
  )
}
