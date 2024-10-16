import { ILocation } from "./location"
import { ISimpleVessel } from "./simpleVessel"

export interface IMonitoredVessel extends ISimpleVessel {
  trustwortiness: number
  reason?: string
}

export default class MonitoredVessel implements IMonitoredVessel {
  constructor(public mmsi: number, public trustwortiness: number, public location: ILocation, public reason?: string) { }
}
