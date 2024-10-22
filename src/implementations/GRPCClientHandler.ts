import { Observable } from 'rxjs'
import {
  AISServiceClientImpl,
  MonitoredVessel,
  SimpleVessel,
  StreamingRequest,
  StreamingResponse,
  VesselInfoRequest,
  VesselInfoResponse,
} from '../../proto/AIS-protobuf/ais'
import { IClientHandler } from '../interfaces/IClientHandler'
import { IDetailedVessel } from '../models/detailedVessel'
import { ISelectionArea } from '../models/selectionArea'
import { IStreamResponse } from '../models/streamResponse'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import { ILocation } from '../models/location'

export default class GRPCClientHandler implements IClientHandler {
  constructor(private readonly client: AISServiceClientImpl) {}

  async GetVesselInfo(request: { mmsi: number; timestamp: number }): Promise<IDetailedVessel> {
    const grpcReq: VesselInfoRequest = {
      mmsi: request.mmsi,
      timestamp: request.timestamp,
    }

    const response = await this.client.GetVesselInfo(grpcReq)

    return this.convertToDetailedVessel(response)
  }

  StartStreaming(request: {
    startTime: number
    selection: ISelectionArea
    timeSpeed: number
  }): Observable<IStreamResponse> {
    const observable = new Observable<IStreamResponse>((observer) => {
      const requestNew: StreamingRequest = {
        selectedArea: request.selection.points,
        startTime: request.startTime,
        timeSpeed: request.timeSpeed,
      }
      const stream = this.client.StartStreaming(requestNew)

      const subscription = stream.subscribe({
        next: (data) => {
          observer.next(this.convertToStreamResponse(data))
        },
        error: (err) => {
          observer.error(err)
        },
        complete: () => {
          observer.complete()
        },
      })

      return () => subscription.unsubscribe()
    })

    return observable
  }

  //////////////////////////////////////////////////////////////////////////////////////

  private convertToDetailedVessel(grpcVessel: VesselInfoResponse): IDetailedVessel {
    return {
      mmsi: grpcVessel.mmsi,
      name: grpcVessel.name,
      shipType: grpcVessel.shipType,
      imo: grpcVessel.imo,
      callSign: grpcVessel.callSign,
      width: grpcVessel.width,
      length: grpcVessel.length,
      positionFixingDevice: grpcVessel.positionFixingDevice,
    }
  }

  private convertToStreamResponse(grpcStreamResponse: StreamingResponse): IStreamResponse {
    return {
      simpleVessels: grpcStreamResponse.vessels.map(this.convertToSimpleVessel.bind(this)),
      monitoredVessels: grpcStreamResponse.monitoredVessels.map(this.convertToMoniteredVessel.bind(this)),
    }
  }

  private convertToMoniteredVessel(grpcVessel: MonitoredVessel): IMonitoredVessel {
    return {
      mmsi: grpcVessel.mmsi,
      trustworthiness: grpcVessel.trustworthiness,
      reason: grpcVessel.reason,
    }
  }

  private convertToSimpleVessel(grpcVessel: SimpleVessel): ISimpleVessel {
    const location: ILocation = {
      point: {
        lon: grpcVessel.location!.point!.lon,
        lat: grpcVessel.location!.point!.lat,
      },
      timestamp: new Date(grpcVessel.location!.timestamp),
      heading: grpcVessel.location!.heading,
    }

    return {
      mmsi: grpcVessel.mmsi,
      location: location,
    }
  }
}
