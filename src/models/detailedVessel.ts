export interface IDetailedVessel {
    id: number,
    name: string,
    mmsi: number,
    shipType?: string,
    imo?: number,
    callSign?: string,
    flag?: string,
    width?: number,
    length?: number,
    positionFixingDevice?: string;
}

export default class DetailedVessel implements IDetailedVessel {
    constructor(public id: number, public name: string, public mmsi: number, public shipType?: string, public imo?: number, public callSign?: string, public flag?: string, public width?: number, public length?: number, public positionFixingDevice?: string) { }
}