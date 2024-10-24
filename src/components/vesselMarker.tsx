import { Marker, Popup as LPopup } from 'react-leaflet'
import { useState } from 'react'
import L from 'leaflet'
import { ISimpleVessel } from '../models/simpleVessel'
import IVesselDetail from '../models/detailedVessel'
import ReactDOMServer from 'react-dom/server'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { useAppContext } from '../contexts/appcontext'
import Popup from './popup'
import VesselSVG from '../svgs/vesselSVG'
interface IVesselMarker {
  vessel: ISimpleVessel
}

export default function VesselMarker({ vessel }: IVesselMarker) {
  const [vesselDetails, setVesselDetails] = useState<IVesselDetail>({ mmsi: 0 })
  const { selectedVesselmmsi, setSelectedVesselmmsi } = useVesselGuiContext()
  const { clientHandler, myDateTime } = useAppContext()

  const selectedColour = 'green'

  const icon = L.divIcon({
    className: 'custom-div-icon',
    html: vessel.location.heading
      ? `${ReactDOMServer.renderToString(
          <VesselSVG heading={vessel.location.heading} selected={selectedVesselmmsi === vessel.mmsi} />
        )}`
      : `
      <div class="circle" style="
        background-color: ${selectedVesselmmsi === vessel?.mmsi ? selectedColour : 'currentColor'};
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
