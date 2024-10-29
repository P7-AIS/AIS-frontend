import * as PIXI from 'pixi.js'
import L from 'leaflet'
import 'leaflet-pixi-overlay'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { useEffect, useState } from 'react'
import { SpriteMarker } from '../models/spriteMarker'
import SpriteMarkerOverlay from '../implementations/SpriteMarkerOverlay'
import { useMap } from 'react-leaflet'

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

function displayVesselToSpriteMarker(
  vessel: DisplayVessel,
  arrowTexture: PIXI.Texture,
  circleTexture: PIXI.Texture,
  onClick: () => void
): SpriteMarker {
  const { simpleVessel, monitoredInfo } = vessel

  const id = vessel.simpleVessel.mmsi

  let sprite: PIXI.Sprite

  if (simpleVessel.location.heading !== undefined) {
    sprite = new PIXI.Sprite(arrowTexture)
    sprite.anchor.set(0.5, 0.5)
    sprite.rotation = simpleVessel.location.heading ? (simpleVessel.location.heading * Math.PI) / 180 : 0
  } else {
    sprite = new PIXI.Sprite(circleTexture)
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

  const popup = L.popup({ className: 'pixi-popup' })
    .setLatLng([simpleVessel.location.point.lat, simpleVessel.location.point.lon])
    .setContent(`Hello im a popup for vessel ${simpleVessel.mmsi}`)

  const position: L.LatLngTuple = [simpleVessel.location.point.lat, simpleVessel.location.point.lon]

  return { id, sprite, popup, position, size: 10 }
}

export default function VesselMarkerOverlay({
  simpleVessels,
  monitoredVessels,
}: {
  simpleVessels: ISimpleVessel[]
  monitoredVessels: IMonitoredVessel[]
}) {
  const { selectedVesselmmsi } = useVesselGuiContext()
  const [markers] = useState<SpriteMarker[]>([])
  const [pixiContainer] = useState(new PIXI.Container())
  const [overlay] = useState(new SpriteMarkerOverlay(markers, pixiContainer))
  const [arrowTexture, setArrowTexture] = useState<PIXI.Texture | null>(null)
  const [circleTexture, setCircleTexture] = useState<PIXI.Texture | null>(null)

  const map = useMap()

  useEffect(() => {
    const loadTextures = async () => {
      const loadedArrowTexture = await PIXI.Assets.load('assets/arrow.svg')
      const loadedCircleTexture = await PIXI.Assets.load('assets/circle.svg')
      setArrowTexture(loadedArrowTexture)
      setCircleTexture(loadedCircleTexture)
    }
    loadTextures()
  })

  useEffect(() => {
    overlay.applyToMap(map)
  }, [map, overlay])

  useEffect(() => {
    if (arrowTexture === null || circleTexture === null) {
      return
    }

    const displayVessels = getDisplayVessels(simpleVessels, monitoredVessels)

    displayVessels.forEach((vessel) => {
      if (!markers.find((marker) => marker.id === vessel.simpleVessel.mmsi)) {
        markers.push(displayVesselToSpriteMarker(vessel, arrowTexture, circleTexture, () => {}))
      }
    })

    const selectedMarker = markers.find((marker) => marker.id === selectedVesselmmsi)

    if (selectedMarker) {
      selectedMarker.sprite.tint = 0xff0000
    }

    if (markers.length !== 0) {
      pixiContainer.addChild(...markers.map((marker) => marker.sprite))
    }
  }, [simpleVessels, monitoredVessels, selectedVesselmmsi, markers, arrowTexture, circleTexture, pixiContainer])

  return null
}
