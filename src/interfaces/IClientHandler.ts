import { Observable } from 'rxjs'
import { IDetailedVessel } from '../models/detailedVessel'
import { ISelectionArea } from '../models/selectionArea'
import { IStreamResponse } from '../models/streamResponse'
import { IMonitoredVessel } from '../models/monitoredVessel'
import { ISimpleVessel } from '../models/simpleVessel'

// This interface abstracts away the client implementation for the backend api
// It should never use any GRPC models

export interface IClientHandler {
  getVesselInfo(request: { mmsi: number; timestamp: number }): Promise<IDetailedVessel>
  getSimpleVessles(request: { timestamp: number }): Promise<ISimpleVessel[]>
  getMonitoredVessels(request: { timestamp: number; selection: ISelectionArea }): Promise<IMonitoredVessel[]>

  //Deprecated cant close stream
  startStreaming(request: {
    startTime: number
    selection: ISelectionArea
    timeSpeed: number
  }): Observable<IStreamResponse>
}
