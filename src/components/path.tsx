import { ILocation } from '../models/location';

interface IPathProps {
	history: ILocation[];
}

export default function Path({ history }: IPathProps) {
	return <h1>history</h1>;
}
