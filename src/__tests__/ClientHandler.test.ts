import GRPCClientHandler from '../implementations/GRPCClientHandler'
import { AISServiceClientImpl, VesselInfoResponse, VesselPathResponse } from '../../proto/AIS-protobuf/ais'
import { IDetailedVessel } from '../models/detailedVessel'
import { IVesselPath } from '../models/vesselPath'

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

describe('GRPCClientHandler - getVesselInfo', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return detailed vessel information', async () => {
    const mockResponse = { mmsi: 123456789, name: 'Test Vessel', shipType: 'Cargo' } as VesselInfoResponse // Mock the actual response
    mockClient.GetVesselInfo.mockResolvedValue(mockResponse)

    const result = await clientHandler.getVesselInfo({ mmsi: 123456789, timestamp: 1609459200 })
    expect(result).toEqual({
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
  it('should convert grpcVessel to DetailedVessel', () => {
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

  it('should convert grpcVesselPath to VesselPath', () => {
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

    const privateMethodProto = Object.getPrototypeOf(clientHandler) //to test private method this is necessary https://stackoverflow.com/questions/48906484/how-to-unit-test-private-methods-in-typescript
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
})
