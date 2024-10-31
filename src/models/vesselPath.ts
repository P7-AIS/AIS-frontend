import { ILocation } from './location'

interface IPath {
  locations: ILocation[]
}

export interface IVesselPath {
  mmsi: number
  pathForecast: IPath
  pathHistory: IPath
}

export default class VesselPath implements IVesselPath {
  constructor(
    public mmsi: number,
    public pathForecast: IPath,
    public pathHistory: IPath
  ) {}
}
