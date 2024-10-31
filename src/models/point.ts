export interface IPoint {
  lat: number
  lon: number
}

export default class Point implements IPoint {
  constructor(
    public lat: number,
    public lon: number
  ) {}
}
