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
