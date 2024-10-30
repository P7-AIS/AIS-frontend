import { MapContainer, TileLayer } from 'react-leaflet'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import VesselMarkerOverlay from './vesselMarkerOverlay'

const VesselMap = ({
  simpleVessels,
  monitoredVessels,
  setMapRef,
}: {
  simpleVessels: ISimpleVessel[]
  monitoredVessels: IMonitoredVessel[]
  setMapRef: React.Dispatch<React.SetStateAction<L.Map | null>>
}) => {
  return (
    <MapContainer
      style={{
        height: '100%',
        width: '100%',
      }}
      center={[56.15674, 10.21076]}
      attributionControl={true}
      zoomControl={false}
      zoom={8}
      minZoom={3}
      scrollWheelZoom={true}
      ref={setMapRef}
    >
      {/* Provider preview https://leaflet-extras.github.io/leaflet-providers/preview/ */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <VesselMarkerOverlay simpleVessels={simpleVessels} monitoredVessels={monitoredVessels} />
    </MapContainer>
  )
}

export default VesselMap
