import { IMonitoredVessel } from './monitoredVessel'
import { ISimpleVessel } from './simpleVessel'

export interface IStreamResponse {
  simpleVessels: ISimpleVessel[]
  monitoredVessels: IMonitoredVessel[]
}
