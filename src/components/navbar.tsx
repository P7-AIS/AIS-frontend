import { useState } from "react"
import { useAppContext } from "../contexts/appcontext"

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
        <div className="w-full">
            <div id="navbar" className="px-4 flex flex-row gap-4 flex-nowrap items-center w-full bg-neutral_2">
                <button className="h-full" onClick={() => setOpened(!opened)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold">Suspicios Vessel Finder</h1>
            </div>
            {opened &&
                <div className="bg-neutral_1 flex flex-col gap-4 px-2 py-4 max-w-96">
                    <div className="flex flex-row justify-between">
                        <label className="font-bold whitespace-nowrap" htmlFor="my-speed">Simulated Speed</label>
                        <input id="my-speed" className="w-48 text-center bg-transparent" type="number" step="1" onChange={(e) => manageSpeedChange(e.target.value)} value={myClockSpeed} />
                    </div>
                    <div className="flex flex-row justify-between">
                        <label className="font-bold whitespace-nowrap" htmlFor='date-picker'>Choose date</label>
                        <input id='date-picker' className="w-48 text-center bg-transparent" type="datetime-local" onChange={(e) => manageDateChange(e.target.value)} value={convertedMyDateTime} />
                    </div>
                </div>
            }
        </div>
    )
}