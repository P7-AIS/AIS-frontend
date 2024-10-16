import { ILocation } from './location'

export interface ISimpleVessel {
  location: ILocation
  mmsi: number
}

export default class SimpleVessel implements ISimpleVessel {
  constructor(public location: ILocation, public mmsi: number) {}
}
