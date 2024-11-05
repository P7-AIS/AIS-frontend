import { MapContainer, TileLayer } from 'react-leaflet'

const VesselMap = ({
  setMapRef,
  overlays,
}: {
  setMapRef: React.Dispatch<React.SetStateAction<L.Map | null>>
  overlays?: React.ReactNode
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
        noWrap={true}
      />
      {overlays}
    </MapContainer>
  )
}

export default VesselMap
