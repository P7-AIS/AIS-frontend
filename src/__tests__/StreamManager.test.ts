import StreamManager, { SIMPLE_FETCH_INTERVAL, MONITORED_FETCH_INTERVAL } from '../implementations/StreamManager';
import { IClientHandler } from '../interfaces/IClientHandler';
import { ISimpleVessel } from '../models/simpleVessel';
import { IMonitoredVessel } from '../models/monitoredVessel';
import { RefObject } from 'react';

jest.mock('../interfaces/IClientHandler');

describe('StreamManager', () => {
    let mockClientHandler: jest.Mocked<IClientHandler>;
    let setAllVessels: jest.Mock<React.Dispatch<React.SetStateAction<ISimpleVessel[]>>>;
    let setMonitoredVessels: jest.Mock<React.Dispatch<React.SetStateAction<IMonitoredVessel[]>>>;
    let dateTimeRef: RefObject<Date>;
    let streamManager: StreamManager;

    beforeEach(() => {
        mockClientHandler = {
            getSimpleVessles: jest.fn().mockResolvedValue([{ mmsi: 123456, location: { point: { lon: 1, lat: 2 }, timestamp: new Date(), heading: 45 } }]),
            getMonitoredVessels: jest.fn().mockResolvedValue([{ mmsi: 123456, trustworthiness: 0.9, reason: 'Test' }]),
        } as unknown as jest.Mocked<IClientHandler>;

        setAllVessels = jest.fn();
        setMonitoredVessels = jest.fn();
        dateTimeRef = { current: new Date() } as RefObject<Date>;

        streamManager = new StreamManager(mockClientHandler, setAllVessels, setMonitoredVessels, dateTimeRef);
    });

    it('should start and stop simple vessel fetching', async () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout')
        streamManager.startSimpleVesselFetching();
        expect(mockClientHandler.getSimpleVessles).toHaveBeenCalledTimes(1); // Called once

        // jest.advanceTimersByTime(SIMPLE_FETCH_INTERVAL); // Simulate 5 seconds for the next call
        // expect(mockClientHandler.getSimpleVessles).toHaveBeenCalledTimes(2); // Called in loop

        streamManager.stopSimpleVesselFetching(); // Stop the loop
        // jest.clearAllTimers();
    });

    it('should handle monitoring zone change and stop fetching if zone is invalid', () => {
        streamManager.onMonitoringZoneChange(undefined);
        expect(setMonitoredVessels).toHaveBeenCalledWith([]);
    });
});