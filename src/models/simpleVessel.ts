import { ILocation } from './location'

export interface ISimpleVessel {
  location: ILocation
  heading?: number
  mmsi: number
}
