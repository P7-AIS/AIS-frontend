import { IClientHandler } from '../interfaces/IClientHandler'
import { IMonitoredVessel } from '../models/monitoredVessel'
import { IPoint } from '../models/point'
import { ISimpleVessel } from '../models/simpleVessel'
import { IStreamManager } from '../interfaces/IStreamManager'
import { RefObject } from 'react'

export default class StreamManager implements IStreamManager {
  private zone: IPoint[] = []
  private simpleVesselTimeout: NodeJS.Timeout | undefined = undefined
  private monitoredVesselTimeout: NodeJS.Timeout | undefined = undefined

  constructor(
    private readonly clientHandler: IClientHandler,
    private readonly setAllVessels: React.Dispatch<React.SetStateAction<ISimpleVessel[]>>,
    private readonly setMonitoredVessels: React.Dispatch<React.SetStateAction<IMonitoredVessel[]>>,
    private readonly myDateTimeRef: RefObject<Date>
  ) {
    this.onMonitoringZoneChange = this.onMonitoringZoneChange.bind(this)
  }

  private async fetchSimpleVesselData() {
    const simpleVessels = await this.clientHandler.getSimpleVessles({
      timestamp: Math.round(this.myDateTimeRef.current!.getTime() / 1000),
    })

    this.manageNewSimpleVessels(simpleVessels)
  }

  private async simpleVesselLoop() {
    try {
      await this.fetchSimpleVesselData()
    } catch (e) {
      console.log(e)
    }
    this.simpleVesselTimeout = setTimeout(this.simpleVesselLoop.bind(this), 5000)
  }

  public async startSimpleVesselFetching() {
    this.simpleVesselLoop()
  }

  public async stopSimpleVesselFetching() {
    clearTimeout(this.simpleVesselTimeout)
  }

  public onMonitoringZoneChange(zone: IPoint[] | undefined) {
    this.zone = zone || []
    if (!zone || zone.length < 4) {
      this.stopMonitoredVesselFetching()
      this.setMonitoredVessels([])
    } else {
      this.startMonitoredVesselFetching()
    }
  }

  private async fetchMonitoredVessels() {
    const monitoredvessels = await this.clientHandler.getMonitoredVessels({
      timestamp: Math.round(this.myDateTimeRef.current!.getTime() / 1000),
      selection: { points: this.zone },
    })
    this.manageNewMonitoredVessels(monitoredvessels)
  }

  private async startMonitoredVesselFetching() {
    try {
      await this.fetchMonitoredVessels()
    } catch (e) {
      console.error(e)
    }
    this.monitoredVesselTimeout = setTimeout(this.startMonitoredVesselFetching.bind(this), 10000)
  }

  private async stopMonitoredVesselFetching() {
    clearTimeout(this.monitoredVesselTimeout)
  }

  private manageNewSimpleVessels(vessels: ISimpleVessel[]) {
    this.setAllVessels(vessels)
  }

  private manageNewMonitoredVessels(vessels: IMonitoredVessel[]) {
    this.setMonitoredVessels(vessels)
  }
}
