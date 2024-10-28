import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import PixiVesselOverlay from './PixiVesselOverlay'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'

const ComponentResize = () => {
  const map = useMap()

  setTimeout(() => {
    map.invalidateSize()
  }, 0)

  return null
}

const LMap = ({
  simpleVessels,
  monitoredVessels,
}: {
  simpleVessels: ISimpleVessel[]
  monitoredVessels: IMonitoredVessel[]
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
    >
      <ComponentResize />
      {/* Provider preview https://leaflet-extras.github.io/leaflet-providers/preview/ */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <PixiVesselOverlay simpleVessels={simpleVessels} monitoredVessels={monitoredVessels} />
    </MapContainer>
  )
}

export default LMap
