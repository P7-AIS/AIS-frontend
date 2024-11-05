import {
  AISServiceClientImpl,
  MonitoredVessel,
  SimpleVessel,
  VesselInfoRequest,
  VesselInfoResponse,
  VesselPathResponse,
} from '../../proto/AIS-protobuf/ais'
import { IClientHandler } from '../interfaces/IClientHandler'
import { IDetailedVessel } from '../models/detailedVessel'
import { ISelectionArea } from '../models/selectionArea'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import { ILocation } from '../models/location'
import { IVesselPath } from '../models/vesselPath'

export default class GRPCClientHandler implements IClientHandler {
  constructor(private readonly client: AISServiceClientImpl) { }

  async getVesselInfo(request: { mmsi: number; timestamp: number }): Promise<IDetailedVessel> {
    const grpcReq: VesselInfoRequest = {
      mmsi: request.mmsi,
      timestamp: request.timestamp,
    }

    const response = await this.client.GetVesselInfo(grpcReq)

    return this.convertToDetailedVessel(response)
  }

  async getVesselPath(request: { mmsi: number; starttime: number; endtime: number }): Promise<IVesselPath> {
    const response = await this.client.GetVesselPath(request)
    return this.convertToVesselPath(response)
  }

  async getSimpleVessles(request: { timestamp: number }): Promise<ISimpleVessel[]> {
    const response = await this.client.GetSimpleVessels({ timestamp: request.timestamp })
    return response.vessels.map(this.convertToSimpleVessel.bind(this))
  }

  async getMonitoredVessels(request: { timestamp: number; selection: ISelectionArea }): Promise<IMonitoredVessel[]> {
    const response = await this.client.GetMonitoredVessels({
      timestamp: request.timestamp,
      selectedArea: request.selection.points,
    })
    return response.vessels.map(this.convertToMoniteredVessel.bind(this))
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

  private convertToVesselPath(grpcVesselPath: VesselPathResponse): IVesselPath {
    return {
      mmsi: grpcVesselPath.mmsi,
      pathForecast: {
        locations: [],
      },
      pathHistory: {
        locations: grpcVesselPath.pathHistory!.locations.map((loc) => {
          return {
            point: { lon: loc.point!.lon, lat: loc.point!.lat },
            heading: loc.heading,
            timestamp: new Date(loc.timestamp),
          }
        }),
      },
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
