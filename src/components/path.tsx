import { useEffect } from 'react';
import { useVesselGuiContext } from '../contexts/vesselGuiContext';
import { ILocation } from '../models/location';
import L from "leaflet"

interface IPathProps {
  path: ILocation[];
  map: L.Map
}

export default function Path({ path, map }: IPathProps) {
  useEffect(() => {
    const points = path.map(loc => L.latLng(loc.point.lat, loc.point.lon))

    const polyline = new L.Polyline(points, {
      color: 'red',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    });
    
    polyline.addTo(map);
    
    return () => {
      map.eachLayer(layer => {
        if(layer instanceof L.Polyline) {
          map.removeLayer(layer)
        }
      }) 
    }
  }, [path])

	return null
}
