import { useState } from 'react'
import './App.css'
import { AppContextProvider, useAppContext } from './contexts/appcontext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VesselMapPage from './pages/vesselMapPage'
import { VesselGuiContextProvider } from './contexts/vesselGuiContext'
import 'leaflet/dist/leaflet.css'

function App() {
  const [count, setCount] = useState(0)
  const { myClockSpeed } = useAppContext()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <AppContextProvider>
                <VesselGuiContextProvider>
                  <VesselMapPage />
                </VesselGuiContextProvider>
              </AppContextProvider>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
