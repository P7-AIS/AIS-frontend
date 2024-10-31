import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AppContextProvider } from './contexts/appcontext.tsx'

createRoot(document.getElementById('root')!).render(
  <AppContextProvider>
    <App />
  </AppContextProvider>
)
