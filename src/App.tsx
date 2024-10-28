import { useEffect, useState } from 'react'
import './App.css'
import { AppContextProvider, useAppContext } from './contexts/appcontext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VesselMapPage from './pages/vesselMapPage'
import { VesselGuiContextProvider } from './contexts/vesselGuiContext'
import 'leaflet/dist/leaflet.css'

function App() {
  const [count, setCount] = useState(0)
  const { myDateTime, setMyDateTime, myClockSpeed } = useAppContext()

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
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <VesselGuiContextProvider>
                <VesselMapPage />
              </VesselGuiContextProvider>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
