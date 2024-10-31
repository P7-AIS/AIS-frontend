export interface IMonitoredVessel {
  mmsi: number
  trustworthiness: number
  reason?: string
}

export default class MonitoredVessel implements IMonitoredVessel {
  constructor(
    public mmsi: number,
    public trustworthiness: number,
    public reason?: string
  ) {}
}
