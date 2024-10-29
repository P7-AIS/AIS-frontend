import { createContext, useContext, useEffect, useState } from 'react'
import { IClientHandler } from '../interfaces/IClientHandler'
import { AISServiceClientImpl, GrpcWebImpl } from '../../proto/AIS-protobuf/ais'
import GRPCClientHandler from '../implementations/GRPCClientHandler'

interface IAppContext {
  myDateTime: Date
  setMyDateTime: React.Dispatch<React.SetStateAction<Date>>
  myClockSpeed: number
  setMyClockSpeed: React.Dispatch<React.SetStateAction<number>>
  clientHandler: IClientHandler
}

const AppContext = createContext<IAppContext | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppContextProvider')
  }
  return context
}

export default AppContext

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [myDateTime, setMyDateTime] = useState<Date>(new Date(1725844950*1000)) ///this should be "new Date()" in the future
  const [myClockSpeed, setMyClockSpeed] = useState<number>(100)

  const grpcWeb = new GrpcWebImpl('http://localhost:8080', {})
  const client = new AISServiceClientImpl(grpcWeb)
  const clientHandler = new GRPCClientHandler(client)

  //manage "fake" global clock
  useEffect(() => {
    function manageTimeChange() {
      setMyDateTime((prevDateTime) => new Date(prevDateTime.getTime() + myClockSpeed * 1000)
      );
    }
    const interval = setInterval(manageTimeChange, 1000);

    return () => clearInterval(interval);
  }, [myClockSpeed]);

  return (
    <AppContext.Provider value={{ myDateTime, setMyDateTime, myClockSpeed, setMyClockSpeed, clientHandler }}>
      {children}
    </AppContext.Provider>
  )
}
