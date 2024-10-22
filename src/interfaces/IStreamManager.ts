import { IPoint } from '../models/point'

export interface IStreamManager {
  startStream(): void
  endStream(): void
  onMonitoringZoneChange(zone: IPoint[] | undefined): void
}
