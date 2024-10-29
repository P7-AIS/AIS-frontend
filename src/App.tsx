import { useEffect, useState } from 'react'
import './App.css'
import { AppContextProvider, useAppContext } from './contexts/appcontext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VesselMapPage from './pages/vesselMapPage'
import { VesselGuiContextProvider } from './contexts/vesselGuiContext'
import 'leaflet/dist/leaflet.css'

function App() {
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
