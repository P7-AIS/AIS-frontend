import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

import L from 'leaflet'

const ComponentResize = () => {
  const map = useMap()

  setTimeout(() => {
    map.invalidateSize()
  }, 0)

  return null
}

interface IMap {
  children: React.ReactNode
  setMapRef: React.Dispatch<React.SetStateAction<L.Map | null>>
}

const LMap = ({ setMapRef, children }: IMap) => {
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
      <ComponentResize />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  )
}

export default LMap
