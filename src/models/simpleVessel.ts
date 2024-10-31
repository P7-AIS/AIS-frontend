import { ILocation } from './location'

export interface ISimpleVessel {
  location: ILocation
  heading?: number
  mmsi: number
}

export default class SimpleVessel implements ISimpleVessel {
  constructor(
    public location: ILocation,
    public mmsi: number,
    public heading?: number
  ) {}
}
