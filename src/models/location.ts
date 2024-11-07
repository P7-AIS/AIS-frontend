import { IPoint } from './point'

export interface ILocation {
  point: IPoint
  heading?: number
  timestamp: Date
}
