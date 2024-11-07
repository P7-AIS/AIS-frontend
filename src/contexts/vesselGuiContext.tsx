import { createContext, useContext, useState } from 'react'
import { ISelectionArea } from '../models/selectionArea'
import { ILocation } from '../models/location'

export enum ActiveGuiTool {
  Rectangle = 'Rectangle',
  Polygon = 'Polygon',
  Mouse = 'Mouse',
}

interface IVesselGuiContext {
  pathHistory: boolean
  setPathHistory: React.Dispatch<React.SetStateAction<boolean>>
  pathForecast: boolean
  setPathForecast: React.Dispatch<React.SetStateAction<boolean>>
  activeTool: ActiveGuiTool
  setActiveTool: React.Dispatch<React.SetStateAction<ActiveGuiTool>>
  activeTime: Date
  setActiveTime: React.Dispatch<React.SetStateAction<Date>>
  selectionArea: ISelectionArea
  setSelectionArea: React.Dispatch<React.SetStateAction<ISelectionArea>>
  selectedVesselmmsi?: number
  setSelectedVesselmmsi: React.Dispatch<React.SetStateAction<number | undefined>>
  selectedVesselPath: ILocation[]
  setSelectedVesselPath: React.Dispatch<React.SetStateAction<ILocation[]>>
  pathIsShown: boolean
  setPathIsShown: React.Dispatch<React.SetStateAction<boolean>>
}

const VesselGuiContext = createContext<IVesselGuiContext | undefined>(undefined)

export const useVesselGuiContext = () => {
  const context = useContext(VesselGuiContext)
  if (context === undefined) {
    throw new Error('useVesselGuiContext must be used within a VesselGuiContextProvider')
  }
  return context
}

export default VesselGuiContext

export const VesselGuiContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [pathHistory, setPathHistory] = useState<boolean>(false)
  const [pathForecast, setPathForecast] = useState<boolean>(false)
  const [activeTool, setActiveTool] = useState<ActiveGuiTool>(ActiveGuiTool.Mouse)
  const [activeTime, setActiveTime] = useState<Date>(new Date())
  const [selectionArea, setSelectionArea] = useState<ISelectionArea>({ points: [] })
  const [selectedVesselmmsi, setSelectedVesselmmsi] = useState<number | undefined>()
  const [selectedVesselPath, setSelectedVesselPath] = useState<ILocation[]>([])
  const [pathIsShown, setPathIsShown] = useState<boolean>(false)

  return (
    <VesselGuiContext.Provider
      value={{
        pathHistory,
        setPathHistory,
        pathForecast,
        setPathForecast,
        activeTool,
        setActiveTool,
        activeTime,
        setActiveTime,
        selectionArea,
        setSelectionArea,
        selectedVesselmmsi,
        setSelectedVesselmmsi,
        selectedVesselPath,
        setSelectedVesselPath,
        pathIsShown,
        setPathIsShown,
      }}
    >
      {children}
    </VesselGuiContext.Provider>
  )
}
