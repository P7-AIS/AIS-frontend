import { createContext, RefObject, useContext, useEffect, useRef, useState } from 'react'
import { IClientHandler } from '../interfaces/IClientHandler'
import { AISServiceClientImpl, GrpcWebImpl } from '../../proto/AIS-protobuf/ais'
import GRPCClientHandler from '../implementations/GRPCClientHandler'

interface IAppContext {
  myDateTime: Date
  myDateTimeRef: RefObject<Date>
  setMyDateTime: React.Dispatch<React.SetStateAction<Date>>
  myClockSpeed: number
  setMyClockSpeed: React.Dispatch<React.SetStateAction<number>>
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
  const [myDateTime, setMyDateTime] = useState<Date>(new Date(1725844950 * 1000)) // Initialized with current time
  const [myClockSpeed, setMyClockSpeed] = useState<number>(100)
  const myDateTimeRef = useRef(new Date(1725844950 * 1000)) // Initialize ref with current time

  const grpcWeb = new GrpcWebImpl('http://localhost:8080', {})
  const client = new AISServiceClientImpl(grpcWeb)
  const clientHandler = new GRPCClientHandler(client)

  // Manage "fake" global clock
  useEffect(() => {
    const manageTimeChange = () => {
      setMyDateTime((prevDateTime) => new Date(prevDateTime.getTime() + myClockSpeed * 1000))
      myDateTimeRef.current = new Date(myDateTimeRef.current.getTime() + myClockSpeed * 1000)
    }

    const interval = setInterval(manageTimeChange, 1000)

    return () => clearInterval(interval) // Clean up the interval on unmount
  }, [myClockSpeed]) // Re-run the effect if myClockSpeed changes

  return (
    <AppContext.Provider
      value={{ myDateTime, setMyDateTime, myClockSpeed, setMyClockSpeed, clientHandler, myDateTimeRef }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
