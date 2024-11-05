import GRPCClientHandler from '../implementations/GRPCClientHandler';
import { AISServiceClientImpl } from '../../proto/AIS-protobuf/ais';

// Create a mock implementation of Rpc
const mockClient: jest.Mocked<AISServiceClientImpl> = {
    GetVesselInfo: jest.fn(),
} as unknown as jest.Mocked<AISServiceClientImpl>;

jest.mock('../../proto/AIS-protobuf/ais');

describe('GRPCClientHandler', () => {
    let clientHandler: GRPCClientHandler;

    beforeEach(() => {
        clientHandler = new GRPCClientHandler(mockClient);
    });

    it('should return detailed vessel information', async () => {
        const mockResponse = { mmsi: 123456789, name: 'Test Vessel', shipType: 'Cargo' } as any; // Mock the actual response
        mockClient.GetVesselInfo.mockResolvedValue(mockResponse);

        const result = await clientHandler.getVesselInfo({ mmsi: 123456789, timestamp: 1609459200 });
        expect(result).toEqual({
            mmsi: 123456789,
            name: 'Test Vessel',
            shipType: 'Cargo',
            imo: undefined,
            callSign: undefined,
            width: undefined,
            length: undefined,
            positionFixingDevice: undefined,
        });
    });
});