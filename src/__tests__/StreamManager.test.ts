import StreamManager from '../implementations/StreamManager'
import { IClientHandler } from '../interfaces/IClientHandler'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import { RefObject } from 'react'

jest.mock('../interfaces/IClientHandler')

let mockClientHandler: jest.Mocked<IClientHandler>
let setAllVessels: jest.Mock<React.Dispatch<React.SetStateAction<ISimpleVessel[]>>>
let setMonitoredVessels: jest.Mock<React.Dispatch<React.SetStateAction<IMonitoredVessel[]>>>
let dateTimeRef: RefObject<Date>
let streamManager: StreamManager

// Setup: runs before each test
beforeEach(() => {
  mockClientHandler = {
    getSimpleVessles: jest
      .fn()
      .mockResolvedValue([
        { mmsi: 123456, location: { point: { lon: 1, lat: 2 }, timestamp: new Date(), heading: 45 } },
      ]),
    getMonitoredVessels: jest.fn().mockResolvedValue([{ mmsi: 123456, trustworthiness: 0.9, reason: 'Test' }]),
  } as unknown as jest.Mocked<IClientHandler>

  setAllVessels = jest.fn()
  setMonitoredVessels = jest.fn()
  dateTimeRef = { current: new Date() } as RefObject<Date>

  streamManager = new StreamManager(mockClientHandler, setAllVessels, setMonitoredVessels, dateTimeRef)
})

// Cleanup: runs after each test to reset mocks
afterEach(() => {
  jest.clearAllMocks()
})

describe('StreamManager', () => {
  it('should start and stop simple vessel fetching', async () => {
    streamManager.startSimpleVesselFetching()
    expect(mockClientHandler.getSimpleVessles).toHaveBeenCalledTimes(1) // Called once
    streamManager.stopSimpleVesselFetching() // Stop the loop
  })

  it('should start and stop monitored vessel fetching', async () => {
    // Start fetching
    streamManager.onMonitoringZoneChange([
      { lon: 1, lat: 2 },
      { lon: 3, lat: 4 },
      { lon: 5, lat: 6 },
      { lon: 7, lat: 8 },
    ])
    expect(mockClientHandler.getMonitoredVessels).toHaveBeenCalledTimes(1)

    // Clear call count
    mockClientHandler.getMonitoredVessels.mockClear()

    // Stop fetching
    streamManager.onMonitoringZoneChange(undefined)
    expect(mockClientHandler.getMonitoredVessels).not.toHaveBeenCalled()
  })

  it('should handle monitoring zone change and stop fetching if zone is invalid', () => {
    streamManager.onMonitoringZoneChange(undefined)
    expect(setMonitoredVessels).toHaveBeenCalledWith([])
  })
})
