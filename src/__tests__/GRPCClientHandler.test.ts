import GRPCClientHandler from '../implementations/GRPCClientHandler'
import {
  AISServiceClientImpl,
  MonitoredVessel,
  SimpleVessel,
  VesselInfoResponse,
  VesselPathResponse,
} from '../../proto/AIS-protobuf/ais'
import { IDetailedVessel } from '../models/detailedVessel'
import { IVesselPath } from '../models/vesselPath'
import { IMonitoredVessel } from '../models/monitoredVessel'
import { ISimpleVessel } from '../models/simpleVessel'

// Create a mock implementation of AISServiceClientImpl
const mockClient: jest.Mocked<AISServiceClientImpl> = {
  GetVesselInfo: jest.fn(),
} as unknown as jest.Mocked<AISServiceClientImpl>

jest.mock('../../proto/AIS-protobuf/ais')

let clientHandler: GRPCClientHandler

// Setup: runs before each test
beforeEach(() => {
  clientHandler = new GRPCClientHandler(mockClient)
})

// Cleanup: runs after each test to reset mocks
afterEach(() => {
  jest.clearAllMocks()
})

describe('GRPCClientHandler - getVesselInfo', () => {
  it('should return detailed vessel information for valid mmsi', async () => {
    const mockResponse = { mmsi: 123456789, name: 'Test Vessel', shipType: 'Cargo' } as VesselInfoResponse // Mock the actual response
    mockClient.GetVesselInfo.mockResolvedValue(mockResponse)

    const result = await clientHandler.getVesselInfo({ mmsi: 123456789, timestamp: 1609459200 })
    expect(result).toEqual<IDetailedVessel>({
      mmsi: 123456789,
      name: 'Test Vessel',
      shipType: 'Cargo',
      imo: undefined,
      callSign: undefined,
      width: undefined,
      length: undefined,
      positionFixingDevice: undefined,
    })
  })
})

describe('GRPCClientHandler - converters', () => {
  it('should convert VesselInfoResponse to DetailedVessel', () => {
    const grpcVessel: VesselInfoResponse = {
      mmsi: 123456789,
      name: 'Tom Cruise',
      shipType: 'Fighter',
      imo: 123,
      callSign: 'maverick',
      width: 12,
      length: 13,
      positionFixingDevice: 'gps',
    }

    const privateMethodProto = Object.getPrototypeOf(clientHandler) //to test private method this is necessary https://stackoverflow.com/questions/48906484/how-to-unit-test-private-methods-in-typescript
    const res = privateMethodProto.convertToDetailedVessel(grpcVessel)

    expect(res).toEqual<IDetailedVessel>({
      mmsi: 123456789,
      name: 'Tom Cruise',
      shipType: 'Fighter',
      imo: 123,
      callSign: 'maverick',
      width: 12,
      length: 13,
      positionFixingDevice: 'gps',
    })
  })

  it('should convert VesselPathResponse to VesselPath', () => {
    const grpcVesselPath: VesselPathResponse = {
      mmsi: 123456789,
      pathHistory: {
        locations: [
          {
            point: { lon: 12, lat: 13 },
            heading: 90,
            timestamp: new Date('2024-01-01T00:00:00Z').getTime(),
          },
        ],
      },
      pathForecast: {
        locations: [],
      },
    }

    const privateMethodProto = Object.getPrototypeOf(clientHandler)
    const res = privateMethodProto.convertToVesselPath(grpcVesselPath)

    expect(res).toEqual<IVesselPath>({
      mmsi: 123456789,
      pathHistory: {
        locations: [
          {
            point: { lon: 12, lat: 13 },
            heading: 90,
            timestamp: new Date('2024-01-01T00:00:00Z'),
          },
        ],
      },
      pathForecast: {
        locations: [],
      },
    })
  })

  it('should convert MonitoredVessel to IMonitoredVessel', () => {
    const grpcVessel: MonitoredVessel = {
      mmsi: 123456789,
      trustworthiness: 0.69,
      reason: 'Test',
    }

    const privateMethodProto = Object.getPrototypeOf(clientHandler)
    const res = privateMethodProto.convertToMoniteredVessel(grpcVessel)

    expect(res).toEqual<IMonitoredVessel>({
      mmsi: 123456789,
      trustworthiness: 0.69,
      reason: 'Test',
    })
  })

  it('should convert SimpleVessel to ISimpleVessel', () => {
    const grpcVessel: SimpleVessel = {
      mmsi: 123456789,
      location: {
        point: { lon: 12, lat: 13 },
        heading: 69,
        timestamp: new Date('2024-01-01T00:00:00Z').getTime(),
      },
    }

    const privateMethodProto = Object.getPrototypeOf(clientHandler)
    const res = privateMethodProto.convertToSimpleVessel(grpcVessel)

    expect(res).toEqual<ISimpleVessel>({
      mmsi: 123456789,
      location: {
        point: { lon: 12, lat: 13 },
        timestamp: new Date('2024-01-01T00:00:00Z'),
        heading: 69,
      },
    })
  })
})
