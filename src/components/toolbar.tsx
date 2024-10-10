import { useVesselGuiContext } from '../contexts/vesselGuiContext';

export default function Toolbar() {
	const { activeTool } = useVesselGuiContext();

	return <h1>toolbar</h1>;
}
