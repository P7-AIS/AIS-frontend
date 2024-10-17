import { ILocation } from "./location"
import { ISimpleVessel } from "./simpleVessel"

export interface IMonitoredVessel extends ISimpleVessel {
  trustworthiness: number
  reason?: string
}

export default class MonitoredVessel implements IMonitoredVessel {
  constructor(public mmsi: number, public trustworthiness: number, public location: ILocation, public reason?: string) { }
}
