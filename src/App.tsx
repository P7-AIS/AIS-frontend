import { useState } from 'react';
import './App.css';
import { useAppContext } from './contexts/appcontext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VesselMapPage from './pages/vesselMapPage';
import { VesselGuiContextProvider } from './contexts/vesselGuiContext';

function App() {
	const [count, setCount] = useState(0);
	const { myClockSpeed } = useAppContext();

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/'>
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
	);
}

export default App;
