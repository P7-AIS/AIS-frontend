import { Observable } from 'rxjs'
import { IDetailedVessel } from '../models/detailedVessel'
import { ISelectionArea } from '../models/selectionArea'
import { IStreamResponse } from '../models/streamResponse'

// This interface abstracts away the client implementation for the backend api
// It should never use any GRPC models

export interface IClientHandler {
  GetVesselInfo(request: { mmsi: number; timestamp: number }): Promise<IDetailedVessel>
  StartStreaming(request: {
    startTime: number
    selection: ISelectionArea[]
    timeSpeed: number
  }): Observable<IStreamResponse>
}
