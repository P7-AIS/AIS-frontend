
export interface IDetailedVessel {
    mmsi: number,
    name?: string,
    shipType?: string,
    imo?: number,
    callSign?: string,
    width?: number,
    length?: number,
    positionFixingDevice?: string;
}

export default class DetailedVessel implements IDetailedVessel {
    constructor(public name: string, public mmsi: number, public shipType?: string, public imo?: number, public callSign?: string, public width?: number, public length?: number, public positionFixingDevice?: string) { }
}