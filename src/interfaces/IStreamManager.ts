import { IPoint } from '../models/point'

export interface IStreamManager {
  startSimpleVesselFetching(): void
  stopSimpleVesselFetching(): void
  onMonitoringZoneChange(zone: IPoint[] | undefined): void
}
