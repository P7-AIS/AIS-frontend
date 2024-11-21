import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { IClientHandler } from '../interfaces/IClientHandler'
import { AISServiceClientImpl, GrpcWebImpl } from '../../proto/AIS-protobuf/ais'
import GRPCClientHandler from '../implementations/GRPCClientHandler'

interface IAppContext {
  myDateTimeRef: React.MutableRefObject<Date>
  myClockSpeed: number
  setMyClockSpeed: React.Dispatch<React.SetStateAction<number>>
  hideVessels: boolean
  setHideVessels: React.Dispatch<React.SetStateAction<boolean>>
  showBaseStations: boolean
  setShowBaseStations: React.Dispatch<React.SetStateAction<boolean>>
  showAtoNs: boolean
  setShowAtoNs: React.Dispatch<React.SetStateAction<boolean>>
  clientHandler: IClientHandler
}

const AppContext = createContext<IAppContext | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider')
  }
  return context
}

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [myClockSpeed, setMyClockSpeed] = useState<number>(100)
  const [hideVessels, setHideVessels] = useState<boolean>(true)
  const [showBaseStations, setShowBaseStations] = useState<boolean>(false)
  const [showAtoNs, setShowAtoNs] = useState<boolean>(false)
  const myDateTimeRef = useRef(new Date(1725874950 * 1000)) // Initialize ref with current time

  const grpcWeb = new GrpcWebImpl('http://localhost:8080', {})
  const client = new AISServiceClientImpl(grpcWeb)
  const clientHandler = new GRPCClientHandler(client)

  // Manage "fake" global clock
  useEffect(() => {
    const manageTimeChange = () => {
      myDateTimeRef.current = new Date(myDateTimeRef.current.getTime() + myClockSpeed * 1000)
    }

    const interval = setInterval(manageTimeChange, 1000)

    return () => clearInterval(interval) // Clean up the interval on unmount
  }, [myClockSpeed]) // Re-run the effect if myClockSpeed changes

  return (
    <AppContext.Provider
      value={{
        myClockSpeed,
        setMyClockSpeed,
        hideVessels,
        setHideVessels,
        showBaseStations,
        setShowBaseStations,
        showAtoNs,
        setShowAtoNs,
        clientHandler,
        myDateTimeRef,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
