import { IPoint } from '../models/point'

export interface IStreamManager {
  fetchNewVesselData(): void
  onMonitoringZoneChange(zone: IPoint[] | undefined): void
}
