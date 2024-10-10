import { IPoint } from "./point";

export interface ILocation {
    point: IPoint,
    heading: number,
    timestamp: Date
}

export default class Location implements ILocation {
    constructor(public point: IPoint, public heading: number, public timestamp: Date) { }

}