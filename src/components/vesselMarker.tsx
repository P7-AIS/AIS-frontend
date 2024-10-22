import { ISimpleVessel } from '../models/simpleVessel'
import L from 'leaflet'
import { Marker, Popup as LPopup } from 'react-leaflet'
import IVesselDetail from '../models/detailedVessel'
import React, { useState } from 'react'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'

interface IVesselMarker {
  vessel: ISimpleVessel
  popup: React.ReactNode
}

export default function VesselMarker({ vessel, popup }: IVesselMarker) {
  const [vesselDetails, setVesselDetails] = useState<IVesselDetail | undefined>(undefined)
  const { selectedVesselmmsi, setSelectedVesselmmsi } = useVesselGuiContext()
  const [markerRef, setMarkerRef] = useState<L.Marker | null>(null)

  const icon = L.divIcon({
    className: 'custom-div-icon',
    html: vessel.location.heading
      ? `
      <div class="vessel-shape" style="
        transform: translate(-10px, -10px) rotate(${vessel.location.heading}deg);
        background-color: ${selectedVesselmmsi === vessel?.mmsi ? '#da3122' : 'currentColor'};
      "></div>
    `
      : `
      <div class="circle" style="
        background-color: ${selectedVesselmmsi === vessel?.mmsi ? '#da3122' : 'currentColor'};
      "></div>
    `,
    iconAnchor: [10, 10],
    popupAnchor: [0, -25],
  })

  if (markerRef) {
    markerRef.on('click', function (e) {
      setSelectedVesselmmsi(vessel.mmsi)
    })
  }

  return (
    <Marker position={[vessel.location.point.lat, vessel.location.point.lon]} icon={icon} ref={setMarkerRef}>
      {vesselDetails && <LPopup>{popup}</LPopup>}
    </Marker>
  )
}
