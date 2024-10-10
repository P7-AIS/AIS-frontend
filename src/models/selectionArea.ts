import { IPoint } from './point'

export interface ISelectionArea {
    points: IPoint[];
}

export default class SelectionArea implements ISelectionArea {
    constructor(public points: IPoint[]) { }
}