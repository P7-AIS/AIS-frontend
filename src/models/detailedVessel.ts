export interface IDetailedVessel {
  mmsi: number
  name?: string
  shipType?: string
  imo?: number
  callSign?: string
  width?: number
  length?: number
  positionFixingDevice?: string
}

export default class DetailedVessel implements IDetailedVessel {
  constructor(
    public mmsi: number,
    public name?: string,
    public shipType?: string,
    public imo?: number,
    public callSign?: string,
    public width?: number,
    public length?: number,
    public positionFixingDevice?: string
  ) {}
}
