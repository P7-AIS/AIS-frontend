import { Marker, Popup as LPopup } from 'react-leaflet'
import L from 'leaflet'
import { ISimpleVessel } from '../models/simpleVessel'
import ReactDOMServer from 'react-dom/server'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import Popup from './popup'
import VesselSVG from '../svgs/vesselSVG'
import CircleSVG from '../svgs/circleSVG'
interface IVesselMarker {
  vessel: ISimpleVessel
}

export default function VesselMarker({ vessel }: IVesselMarker) {
  const { selectedVesselmmsi, setSelectedVesselmmsi } = useVesselGuiContext()

  const icon = L.divIcon({
    className: 'custom-div-icon',
    html: vessel.location.heading
      ? `${ReactDOMServer.renderToString(
          <VesselSVG heading={vessel.location.heading} selected={selectedVesselmmsi === vessel.mmsi} />
        )}`
      : `${ReactDOMServer.renderToString(<CircleSVG selected={selectedVesselmmsi === vessel.mmsi} />)}`,
    iconAnchor: [0, 0],
    popupAnchor: [0, -15],
  })

  const handleVesselClick = () => {
    if (selectedVesselmmsi === vessel.mmsi) {
      setSelectedVesselmmsi(undefined)
    } else {
      setSelectedVesselmmsi(vessel.mmsi)
    }
  }

  return (
    <Marker
      eventHandlers={{ click: handleVesselClick }}
      position={[vessel.location.point.lat, vessel.location.point.lon]}
      icon={icon}
    >
      <LPopup>{selectedVesselmmsi === vessel.mmsi && <Popup mmsi={vessel.mmsi} />}</LPopup>
    </Marker>
  )
}
