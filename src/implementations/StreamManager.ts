import { IClientHandler } from '../interfaces/IClientHandler'
import { IMonitoredVessel } from '../models/monitoredVessel'
import { IPoint } from '../models/point'
import { ISimpleVessel } from '../models/simpleVessel'
import { IStreamManager } from '../interfaces/IStreamManager'

export default class StreamManager implements IStreamManager {
  private allVessels: ISimpleVessel[] | undefined
  private monitoredVessels: IMonitoredVessel[] | undefined
  private zone: IPoint[] = []
  private myClockSpeed: number
  private myDateTime: Date

  constructor(
    private readonly clientHandler: IClientHandler,
    private readonly setAllVessels: React.Dispatch<React.SetStateAction<ISimpleVessel[] | undefined>>,
    private readonly setMonitoredVessels: React.Dispatch<React.SetStateAction<IMonitoredVessel[] | undefined>>
  ) {
    this.onMonitoringZoneChange = this.onMonitoringZoneChange.bind(this)
  }

  public syncAllVessels(vessels: ISimpleVessel[] | undefined) {
    this.allVessels = vessels
  }
  public syncMonitoredVessels(vessels: IMonitoredVessel[] | undefined) {
    this.monitoredVessels = vessels
  }
  public syncMyDatetime(date: Date) {
    this.myDateTime = date
  }
  public syncMyClockSpeed(speed: number) {
    this.myClockSpeed = speed
  }

  public async fetchNewVesselData() {
    const simpleVessels = await this.clientHandler.getSimpleVessles({
      timestamp: 1725844950,
    })

    let monitoredVessels: IMonitoredVessel[] = []

    if (this.zone.length >= 4) {
      monitoredVessels = await this.clientHandler.getMonitoredVessels({
        selection: { points: this.zone },
        timestamp: 1725844950,
      })
    }
    console.log(simpleVessels)
    console.log(monitoredVessels)

    this.manageNewSimpleVessels(simpleVessels)
    this.manageNewMonitoredVessels(monitoredVessels)
  }

  public onMonitoringZoneChange(zone: IPoint[] | undefined) {
    this.zone = zone || []
    this.setAllVessels(undefined)
    this.setMonitoredVessels(undefined)
    this.fetchNewVesselData()
  }

  private manageNewSimpleVessels(vessels: ISimpleVessel[]) {
    const newVessels = this.manageVesselsFromStream(vessels, this.allVessels)
    this.setAllVessels(newVessels)
  }

  private manageNewMonitoredVessels(vessels: IMonitoredVessel[]) {
    const newVessels = this.manageVesselsFromStream(vessels, this.monitoredVessels)
    this.setMonitoredVessels(newVessels)
  }

  private manageVesselsFromStream<T extends ISimpleVessel | IMonitoredVessel>(
    vessels: T[],
    curVessels: T[] | undefined
  ): T[] {
    const locVessels: T[] = curVessels ? JSON.parse(JSON.stringify(curVessels)) : []
    vessels.forEach((vessel) => {
      if (locVessels?.map((v) => v.mmsi).includes(vessel.mmsi)) {
        const idx = locVessels.findIndex((v) => v.mmsi === vessel.mmsi)
        locVessels[idx] = vessel
      } else {
        locVessels?.push(vessel)
      }
    })

    return locVessels
  }
}
