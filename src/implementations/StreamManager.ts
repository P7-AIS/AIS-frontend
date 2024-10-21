import { IClientHandler } from '../interfaces/IClientHandler'
import { IMonitoredVessel } from '../models/monitoredVessel'
import { IPoint } from '../models/point'
import { ISimpleVessel } from '../models/simpleVessel'
import { IStreamManager } from '../interfaces/IStreamManager'
import { Subscription } from 'rxjs'

export default class StreamManager implements IStreamManager {
  private allVessels: ISimpleVessel[] | undefined
  private monitoredVessels: IMonitoredVessel[] | undefined
  private subscription?: Subscription = undefined
  private zone?: IPoint[]

  constructor(
    private readonly clientHandler: IClientHandler,
    private readonly setAllVessels: React.Dispatch<React.SetStateAction<ISimpleVessel[] | undefined>>,
    private readonly setMonitoredVessels: React.Dispatch<React.SetStateAction<IMonitoredVessel[] | undefined>>
  ) {}

  public syncAllVessels(vessels: ISimpleVessel[] | undefined) {
    this.allVessels = vessels
  }
  public syncMonitoredVessels(vessels: IMonitoredVessel[] | undefined) {
    this.monitoredVessels = vessels
  }

  public startStream() {
    const stream = this.clientHandler.StartStreaming({
      startTime: 1725844950,
      selection: { points: this.zone || [] },
      timeSpeed: 1,
    })

    this.subscription = stream.subscribe((data) => {
      console.log('managing data')
      this.manageNewSimpleVessels(data.simpleVessels)
      this.manageNewMonitoredVessels(data.monitoredVessels)
      console.log('data managed')
    })
  }

  public endStream() {
    this.subscription?.unsubscribe()
  }

  public onMonitoringZoneChange(zone: IPoint[] | undefined) {
    this.zone = zone
    this.endStream()
    this.setAllVessels(undefined)
    this.setMonitoredVessels(undefined)
    this.startStream()
  }

  private manageNewSimpleVessels(vessels: ISimpleVessel[]) {
    const locVessels = this.allVessels ? JSON.parse(JSON.stringify(this.allVessels)) : []
    console.log('mananig simple vessels')
    vessels.forEach((vessel) => {
      if (locVessels?.map((v) => v.mmsi).includes(vessel.mmsi)) {
        const idx = locVessels.findIndex((v) => v.mmsi === vessel.mmsi)
        locVessels[idx] = vessel
        console.log('updated existing vessel')
      } else {
        locVessels?.push(vessel)
        console.log('added new vessel')
      }
    })

    this.setAllVessels(locVessels)
  }

  private manageNewMonitoredVessels(vessels: IMonitoredVessel[]) {}
}
