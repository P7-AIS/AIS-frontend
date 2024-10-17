import { createContext, useContext, useState } from 'react'
import { ISelectionArea } from '../models/selectionArea'

export enum ActiveGuiTool {
  ZoomIn,
  ZoomOut,
  Rectangle,
  Polygon,
  Mouse,
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
  selectionArea?: ISelectionArea
  setSelectionArea: React.Dispatch<React.SetStateAction<ISelectionArea | undefined>>
}

const VesselGuiContext = createContext<IVesselGuiContext | undefined>(undefined)

export const useVesselGuiContext = () => {
  const context = useContext(VesselGuiContext)
  if (context === undefined) {
    throw new Error('useVesselGuiContext must be used within a AppContextProvider')
  }
  return context
}

export default VesselGuiContext

export const VesselGuiContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [pathHistory, setPathHistory] = useState<boolean>(false)
  const [pathForecast, setPathForecast] = useState<boolean>(false)
  const [activeTool, setActiveTool] = useState<ActiveGuiTool>(ActiveGuiTool.Mouse)
  const [activeTime, setActiveTime] = useState<Date>(new Date())
  const [selectionArea, setSelectionArea] = useState<ISelectionArea | undefined>()

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
      }}
    >
      {children}
    </VesselGuiContext.Provider>
  )
}
