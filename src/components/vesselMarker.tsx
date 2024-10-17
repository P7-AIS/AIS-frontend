import { ISimpleVessel } from '../models/simpleVessel'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup as LPopup, useMap } from 'react-leaflet'
import Popup from './popup'
import IVesselDetail from '../models/detailedVessel'
import React, { useState } from 'react'

interface IVesselMarker {
  vessel: ISimpleVessel;
  popup: React.ReactNode;
}

export default function VesselMarker({ vessel, popup }: IVesselMarker) {
  const [vesselDetails, setVesselDetails] = useState<IVesselDetail | undefined>(undefined)

  const icon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 40px solid #c30b82; transform: translate(-5px, -20px) rotate(${
      vessel.location.heading || 0
    }deg);"></div>
`,
    iconAnchor: [0, 0],
    popupAnchor: [0, -25],
  })

  return (
    <Marker position={[vessel.location.point.lat, vessel.location.point.lon]} icon={icon}>
      {vesselDetails && (
        <LPopup>
          {popup}
        </LPopup>
      )}
    </Marker>
  )
}
