import * as PIXI from 'pixi.js'
import L from 'leaflet'
import 'leaflet-pixi-overlay'
import { ISimpleVessel } from '../models/simpleVessel'
import { IMonitoredVessel } from '../models/monitoredVessel'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { useEffect, useState } from 'react'
import { ISpriteMarker } from '../models/spriteMarker'
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
  onClick: (sprite: PIXI.Sprite) => void
): ISpriteMarker {
  const { simpleVessel, monitoredInfo } = vessel

  const id = vessel.simpleVessel.mmsi

  let sprite: PIXI.Sprite

  if (simpleVessel.location.heading !== undefined) {
    sprite = new PIXI.Sprite(arrowTexture)
    sprite.anchor.set(0.5, 0.5)
    sprite.rotation =
      Math.PI / 2 + (simpleVessel.location.heading ? (simpleVessel.location.heading * Math.PI) / 180 : 0)
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
  sprite.on('click', () => onClick(sprite))

  const popupContent = `Hello im a popup for vessel ${simpleVessel.mmsi}`

  const position: L.LatLngTuple = [simpleVessel.location.point.lat, simpleVessel.location.point.lon]

  return { id, sprite, popupContent, position, size: 10 }
}

export default function VesselMarkerOverlay({
  simpleVessels,
  monitoredVessels,
}: {
  simpleVessels: ISimpleVessel[]
  monitoredVessels: IMonitoredVessel[]
}) {
  const { selectedVesselmmsi, setSelectedVesselmmsi } = useVesselGuiContext()
  const [markers] = useState<ISpriteMarker[]>([])
  const [pixiContainer] = useState(new PIXI.Container())
  const [overlay] = useState(new SpriteMarkerOverlay(markers, pixiContainer))
  const [arrowTexture, setArrowTexture] = useState<PIXI.Texture | null>(null)
  const [circleTexture, setCircleTexture] = useState<PIXI.Texture | null>(null)

  const map = useMap()

  //Load textures
  useEffect(() => {
    const loadTextures = async () => {
      const loadedArrowTexture = await PIXI.Assets.load('assets/arrow.svg')
      const loadedCircleTexture = await PIXI.Assets.load('assets/circle.svg')
      setArrowTexture(loadedArrowTexture)
      setCircleTexture(loadedCircleTexture)
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

  useEffect(() => {
    if (arrowTexture === null || circleTexture === null) {
      return
    }

    markers.splice(0, markers.length)

    getDisplayVessels(simpleVessels, monitoredVessels).forEach((vessel) => {
      {
        markers.push(
          displayVesselToSpriteMarker(vessel, arrowTexture, circleTexture, () => {
            setSelectedVesselmmsi(vessel.simpleVessel.mmsi)
          })
        )
      }
    })

    if (markers.length !== 0) {
      pixiContainer.removeChildren()
      pixiContainer.addChild(...markers.map((marker) => marker.sprite))
      overlay.updatedMarkers()
      overlay.redraw()
    }
  }, [
    arrowTexture,
    circleTexture,
    markers,
    monitoredVessels,
    overlay,
    pixiContainer,
    setSelectedVesselmmsi,
    simpleVessels,
  ])

  return null
}
