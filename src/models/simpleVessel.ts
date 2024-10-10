import { ILocation } from "./location";

export interface ISimpleVessel {
    location: ILocation,
    vesselId: number
}

export default class SimpleVessel implements ISimpleVessel {
    constructor(public location: ILocation, public vesselId: number) { }
}