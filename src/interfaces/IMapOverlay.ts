export interface IMapOverlay {
  applyToMap(map: L.Map): void
  removeFromMap(): void
  redraw(): void
  updated(): void
}
