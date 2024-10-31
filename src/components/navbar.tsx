import { useState } from "react"
import { useAppContext } from "../contexts/appcontext"
import FaviconSVG from "../svgs/faviconSVG"
import HamburgerSVG from "../svgs/hamburgerSVG"
import CloseSVG from "../svgs/closeSVG"

interface INavbar {

}

export default function Navbar({ }: INavbar) {
    const [opened, setOpened] = useState<boolean>(false)
    const { myDateTime, myClockSpeed, setMyDateTime, setMyClockSpeed } = useAppContext()
    const convertedMyDateTime = `${myDateTime.getFullYear()}-${myDateTime.getMonth().toString().padStart(2, "0")}-${myDateTime.getDate().toString().padStart(2, "0")}T${myDateTime.getHours().toString().padStart(2, "0")}:${myDateTime.getMinutes().toString().padStart(2, "0")}`

    function manageSpeedChange(val: string) {
        try {
            const parsed = parseInt(val)
            setMyClockSpeed(parsed)
        } catch (e) {
            console.error(e)
            setMyClockSpeed(1)
        }
    }

    function manageDateChange(val: string) {
        const parsed = new Date(val)
        setMyDateTime(parsed)
    }

    return (
        <div className="w-fit">
            <div id="navbar" className="relative px-5 flex flex-row gap-4 flex-nowrap items-center w-full bg-gray-700 text-white rounded-lg p-4">
                <FaviconSVG></FaviconSVG>
                <h1 className="text-xl font-bold">Suspicios Vessel Finder</h1>
                { opened &&
                    <div id="settings-container" className="absolute left-[101%] top-0 bg-gray-200 text-gray-800 flex flex-col gap-4 p-4 w-fit rounded-md shadow-lg">
                        <h2 className="text-lg font-bold">Simulation settings</h2>
                        
                        <div className="flex flex-row justify-between gap-4">
                            <label className="font-medium whitespace-nowrap" htmlFor="my-speed">Simulated Speed</label>
                            <input id="my-speed" className="w-20 text-right bg-transparent" type="number" step="1" onChange={(e) => manageSpeedChange(e.target.value)} value={myClockSpeed} />
                        </div>
                        <div className="flex flex-row justify-between gap-4">
                            <label className="font-medium whitespace-nowrap" htmlFor='date-picker'>Simulated Date</label>
                            <input id='date-picker' className="w-40 text-right bg-transparent" type="datetime-local" onChange={(e) => manageDateChange(e.target.value)} value={convertedMyDateTime} />
                        </div>
                    </div>
                }
                <button id="menu-icon" title="Show/hide simulation settings" className="" onClick={() => setOpened(!opened)}>
                    { !opened ? 
                        <HamburgerSVG/>
                    : 
                        <CloseSVG/>
                    }   
                </button>
            </div>
        </div>
    )
}