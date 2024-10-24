import { Marker, Popup as LPopup } from 'react-leaflet'
import { useState } from 'react'
import L from 'leaflet'
import { ISimpleVessel } from '../models/simpleVessel'
import IVesselDetail from '../models/detailedVessel'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { useAppContext } from '../contexts/appcontext'
import Popup from './popup'

interface IVesselMarker {
  vessel: ISimpleVessel
}

export default function VesselMarker({ vessel }: IVesselMarker) {
  const [vesselDetails, setVesselDetails] = useState<IVesselDetail>({ mmsi: 0 })
  const { selectedVesselmmsi, setSelectedVesselmmsi } = useVesselGuiContext()
  const { clientHandler, myDateTime } = useAppContext()

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
    iconAnchor: [0, 0],
    popupAnchor: [0, -10],
  })

  const handleVesselClick = async () => {
    if (selectedVesselmmsi === vessel.mmsi) {
      setSelectedVesselmmsi(undefined)
    } else {
      const details = await clientHandler.GetVesselInfo({ mmsi: vessel.mmsi, timestamp: myDateTime.getTime() })
      setVesselDetails(details)
      setSelectedVesselmmsi(vessel.mmsi)
    }
  }

  return (
    <Marker
      eventHandlers={{ click: handleVesselClick }}
      position={[vessel.location.point.lat, vessel.location.point.lon]}
      icon={icon}
    >
      <LPopup>
        <Popup vessel={vesselDetails} />
      </LPopup>
    </Marker>
  )
}
