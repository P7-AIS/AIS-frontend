import { Observable } from 'rxjs'
import {
  AISServiceClientImpl,
  Location,
  MonitoredVessel,
  Point,
  SimpleVessel,
  StreamingResponse,
  VesselInfoRequest,
  VesselInfoResponse,
} from '../../proto/AIS-protobuf/ais'
import { IClientHandler } from '../interfaces/IClientHandler'
import { IDetailedVessel } from '../models/detailedVessel'
import { ISelectionArea } from '../models/selectionArea'
import { IStreamResponse } from '../models/streamResponse'
import { ILocation } from '../models/location'
import { IPoint } from '../models/point'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'

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
    selection: ISelectionArea[]
    timeSpeed: number
  }): Observable<IStreamResponse> {
    const observable = new Observable<IStreamResponse>((observer) => {
      const stream = this.client.StartStreaming(request)

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
      id: grpcVessel.mmsi,
      name: grpcVessel.name,
      mmsi: grpcVessel.mmsi,
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
      trustwortiness: grpcVessel.trustworthiness,
      reason: grpcVessel.reason,
    }
  }

  private convertToSimpleVessel(grpcVessel: SimpleVessel): ISimpleVessel {
    return {
      mmsi: grpcVessel.mmsi,
      location: this.convertToLocation(grpcVessel.location!),
    }
  }

  private convertToLocation(grpcLocation: Location): ILocation {
    return {
      point: this.convertToPoint(grpcLocation.point!),
      heading: grpcLocation.heading,
      timestamp: new Date(grpcLocation.timestamp),
    }
  }

  private convertToPoint(grpcPoint: Point): IPoint {
    return {
      lat: grpcPoint.lat,
      lon: grpcPoint.lon,
    }
  }
}
