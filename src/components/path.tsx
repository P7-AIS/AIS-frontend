import { useVesselGuiContext } from '../contexts/vesselGuiContext';
import { ILocation } from '../models/location';
import L from "leaflet"

interface IPathProps {
  path: ILocation[];
  map: L.Map
}

export default function Path({ path, map }: IPathProps) {
  const points = path.map(loc => L.latLng(loc.point.lat, loc.point.lon))

  const polyline = new L.Polyline(points, {
    color: 'red',
    weight: 3,
    opacity: 0.5,
    smoothFactor: 1
  });
  polyline.addTo(map);

	return null
}
