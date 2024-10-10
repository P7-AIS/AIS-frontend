export interface IMonitoredVessel {
    vesselId: string;
    trustwortiness: number;
    reason?: string;
}

export default class MonitoredVessel implements IMonitoredVessel {
    constructor(
        public vesselId: string,
        public trustwortiness: number,
        public reason?: string
    ) { }
}