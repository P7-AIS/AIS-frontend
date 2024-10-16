export interface IMonitoredVessel {
  mmsi: number
  trustwortiness: number
  reason?: string
}

export default class MonitoredVessel implements IMonitoredVessel {
  constructor(public mmsi: number, public trustwortiness: number, public reason?: string) {}
}
