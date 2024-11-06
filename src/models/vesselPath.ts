import { ILocation } from './location'

interface IPath {
  locations: ILocation[]
}

export interface IVesselPath {
  mmsi: number
  pathForecast: IPath
  pathHistory: IPath
}
