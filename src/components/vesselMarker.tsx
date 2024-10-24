import { ISimpleVessel } from '../models/simpleVessel'
import L from 'leaflet'
import { Marker, Popup as LPopup } from 'react-leaflet'
import IVesselDetail from '../models/detailedVessel'
import React, { useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import VesselSVG from '../svgs/vesselSVG'
interface IVesselMarker {
  vessel: ISimpleVessel
  popup: React.ReactNode
}

export default function VesselMarker({ vessel, popup }: IVesselMarker) {
  const [vesselDetails, setVesselDetails] = useState<IVesselDetail | undefined>(undefined)
  const { selectedVesselmmsi, setSelectedVesselmmsi } = useVesselGuiContext()
  const [markerRef, setMarkerRef] = useState<L.Marker | null>(null)

  const selectedColour = "green"

  const icon = L.divIcon({
    className: 'custom-div-icon',
    html: vessel.location.heading
      ? `${ReactDOMServer.renderToString(<VesselSVG heading={vessel.location.heading} selected={selectedVesselmmsi === vessel.mmsi}/>)}`
      : `
      <div class="circle" style="
        background-color: ${selectedVesselmmsi === vessel?.mmsi ? selectedColour : 'currentColor'};
      "></div>
    `,
    iconAnchor: [0, 0],
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
