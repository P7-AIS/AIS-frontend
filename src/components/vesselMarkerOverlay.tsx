import * as PIXI from 'pixi.js'
import L from 'leaflet'
import 'leaflet-pixi-overlay'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { useEffect, useState } from 'react'
import { ISpriteMarkerOptions } from '../models/spriteMarkerOptions'
import SpriteMarkerOverlayHandler from '../implementations/SpriteMarkerOverlayHandler'
import { useMap } from 'react-leaflet'
import { useAppContext } from '../contexts/appcontext'

export default function VesselMarkerOverlay({
  simpleVessels,
  monitoredVessels,
}: {
  simpleVessels: ISimpleVessel[]
  monitoredVessels: IMonitoredVessel[]
}) {
  const { selectedVesselmmsi, setSelectedVesselmmsi } = useVesselGuiContext()
  const [markerOptions] = useState<ISpriteMarkerOptions[]>([])
  const [pixiContainer] = useState(new PIXI.Container())
  const [overlay] = useState(new SpriteMarkerOverlayHandler(markerOptions, pixiContainer))
  const [arrowTexture, setArrowTexture] = useState<PIXI.Texture | null>(null)
  const [selectedArrowTexture, setSelectedArrowTexture] = useState<PIXI.Texture | null>(null)
  const [circleTexture, setCircleTexture] = useState<PIXI.Texture | null>(null)
  const [selectedCircleTexture, setSelectedCircleTexture] = useState<PIXI.Texture | null>(null)
  const { clientHandler } = useAppContext()

  const map = useMap()

  //Load textures
  useEffect(() => {
    const loadTextures = async () => {
      const loadedArrowTexture = await PIXI.Assets.load('assets/arrow.svg')
      const loadedSelectedArrowTexture = await PIXI.Assets.load('assets/selectedArrow.svg')
      const loadedCircleTexture = await PIXI.Assets.load('assets/circle.svg')
      const loadedSelectedCircleTexture = await PIXI.Assets.load('assets/selectedCircle.svg')
      setArrowTexture(loadedArrowTexture)
      setSelectedArrowTexture(loadedSelectedArrowTexture)
      setCircleTexture(loadedCircleTexture)
      setSelectedCircleTexture(loadedSelectedCircleTexture)
    }
    loadTextures()
  }, [])

  // Apply overlay to map should only ever happen once
  useEffect(() => {
    overlay.applyToMap(map)
    return () => {
      overlay.removeFromMap()
    }
  }, [map, overlay])

  // Update markers
  useEffect(() => {
    if (arrowTexture === null || circleTexture === null) {
      return
    }

    pixiContainer.removeChildren()
    markerOptions.splice(0, markerOptions.length)

    getDisplayVessels(simpleVessels, monitoredVessels).forEach((vessel) => {
      {
        const onClick = () =>
          setSelectedVesselmmsi((selectedVesselmmsi) =>
            selectedVesselmmsi === vessel.simpleVessel.mmsi ? undefined : vessel.simpleVessel.mmsi
          )

        markerOptions.push(
          displayVesselToSpriteMarkerOption(vessel, arrowTexture, selectedArrowTexture, circleTexture, selectedCircleTexture, selectedVesselmmsi === vessel.simpleVessel.mmsi, onClick)
        )
      }
    })

    if (markerOptions.length !== 0) {
      pixiContainer.addChild(...markerOptions.map((option) => option.sprite))
      overlay.updated()
      overlay.redraw()
    }
  }, [
    arrowTexture,
    selectedArrowTexture,
    circleTexture,
    selectedCircleTexture,
    clientHandler,
    markerOptions,
    monitoredVessels,
    overlay,
    pixiContainer,
    setSelectedVesselmmsi,
    simpleVessels,
    selectedVesselmmsi
  ])

  return null
}

interface DisplayVessel {
  simpleVessel: ISimpleVessel
  monitoredInfo?: IMonitoredVessel
}

function getDisplayVessels(simpleVessels: ISimpleVessel[], monitoredVessels: IMonitoredVessel[]): DisplayVessel[] {
  return simpleVessels.map((simpleVessel) => {
    const monitoredInfo = monitoredVessels.find((monitoredVessel) => monitoredVessel.mmsi === simpleVessel.mmsi)
    return { simpleVessel, monitoredInfo }
  })
}

function trustworthinessToColor(trustworthiness?: number): number {
  if (trustworthiness === undefined) return 0x000000
  if (trustworthiness < 0.5) return 0xff0000
  if (trustworthiness < 0.8) return 0xffff00
  return 0x00ff00
}

function displayVesselToSpriteMarkerOption(
  vessel: DisplayVessel,
  arrowTexture: PIXI.Texture,
  selectedArrowTexture: PIXI.Texture,
  circleTexture: PIXI.Texture,
  selectedCircleTexture: PIXI.Texture,
  isSelected: boolean,
  onClick: () => void,
): ISpriteMarkerOptions {
  const { simpleVessel, monitoredInfo } = vessel

  let sprite: PIXI.Sprite

  if (simpleVessel.location.heading !== undefined) {
    sprite = new PIXI.Sprite(isSelected ? selectedArrowTexture : arrowTexture)
    sprite.anchor.set(0.5, 0.5)
    sprite.rotation =
      Math.PI / 2 + (simpleVessel.location.heading ? (simpleVessel.location.heading * Math.PI) / 180 : 0)
  } else {
    sprite = new PIXI.Sprite(isSelected ? selectedCircleTexture : circleTexture)
    sprite.anchor.set(0.5, 0.5)
  }

  if (monitoredInfo) {
    sprite.tint = trustworthinessToColor(monitoredInfo.trustworthiness)
  } else {
    sprite.alpha = 0.3
    sprite.tint = 0x000000
  }

  sprite.eventMode = 'dynamic'
  sprite.cursor = 'pointer'
  sprite.on('click', onClick)

  const size = isSelected ? 20 : 13
  const position: L.LatLngTuple = [simpleVessel.location.point.lat, simpleVessel.location.point.lon]

  return { sprite, position, size }
}
