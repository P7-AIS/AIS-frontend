import { createContext, useContext, useState } from 'react';

interface IAppContext {
	myDateTime: Date;
	setMyDateTime: React.Dispatch<React.SetStateAction<Date>>;
	myClockSpeed: number;
	setMyClockSpeed: React.Dispatch<React.SetStateAction<number>>;
}

const AppContext = createContext<IAppContext | undefined>(undefined);

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error('useAppContext must be used within a AppContextProvider');
	}
	return context;
};

export default AppContext;

export const AppContextProvider = ({
	children
}: {
	children: React.ReactNode;
}) => {
	const [myDateTime, setMyDateTime] = useState<Date>(new Date());
	const [myClockSpeed, setMyClockSpeed] = useState<number>(12);

	return (
		<AppContext.Provider
			value={{ myDateTime, setMyDateTime, myClockSpeed, setMyClockSpeed }}>
			{children}
		</AppContext.Provider>
	);
};
