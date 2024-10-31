import { useState, useEffect } from 'react'
import { useAppContext } from '../contexts/appcontext'
import FaviconSVG from '../svgs/faviconSVG'
import HamburgerSVG from '../svgs/hamburgerSVG'
import CloseSVG from '../svgs/closeSVG'

export default function Navbar() {
  const { myClockSpeed, setMyClockSpeed, myDateTimeRef } = useAppContext()
  const [opened, setOpened] = useState<boolean>(false)
  const [localClock, setLocalClock] = useState<Date>(myDateTimeRef.current)
  const [localSpeed, setLocalSpeed] = useState<string>(myClockSpeed.toString())
  const convertedMyDateTime = `${localClock.getFullYear()}-${(localClock.getMonth() + 1).toString().padStart(2, '0')}-${localClock.getDate().toString().padStart(2, '0')}T${localClock.getHours().toString().padStart(2, '0')}:${localClock.getMinutes().toString().padStart(2, '0')}`

  useEffect(() => {
    function updateLocalClock() {
      setLocalClock(myDateTimeRef.current)
    }
    const interval = setInterval(updateLocalClock, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  function manageSpeedChange(val: string) {
    setLocalSpeed(val)
    try {
      const parsed = parseInt(val)
      if (isNaN(parsed)) {
        return
      }
      setMyClockSpeed(parsed)
    } catch (e) {
      console.error(e)
      setMyClockSpeed(1)
    }
  }

  function manageDateChange(val: string) {
    const parsed = new Date(val)
    myDateTimeRef.current = parsed
  }

  return (
    <div
      id="navbar"
      className="relative px-5 flex flex-row justify-between gap-4 flex-nowrap items-center w-full bg-gray-700 text-white rounded-lg p-4"
    >
      <div className="flex flex-row gap-4 items-center">
        <FaviconSVG></FaviconSVG>
        <h1 className="text-xl font-bold">Suspicious Vessel Finder</h1>
      </div>
      {opened && (
        <div
          id="settings-container"
          className="absolute left-[101%] top-0 bg-gray-700 opacity-80 text-white flex flex-col gap-4 p-4 w-fit rounded-xl shadow-lg"
        >
          <h2 className="text-lg font-bold">Simulation settings</h2>
          <div className="flex flex-row justify-between gap-4">
            <label className="font-medium whitespace-nowrap" htmlFor="my-speed">
              Simulated Speed
            </label>
            <input
              id="my-speed"
              className="w-20 text-right input-field"
              type="number"
              step="1"
              onChange={(e) => manageSpeedChange(e.target.value)}
              value={localSpeed}
            />
          </div>
          <div className="flex flex-row justify-between gap-4">
            <label className="font-medium whitespace-nowrap" htmlFor="date-picker">
              Simulated Date
            </label>
            <input
              id="date-picker"
              className="w-fit text-right input-field"
              type="datetime-local"
              onChange={(e) => manageDateChange(e.target.value)}
              value={convertedMyDateTime}
            />
          </div>
        </div>
      )}
      <button id="menu-icon" title="Show/hide simulation settings" className="" onClick={() => setOpened(!opened)}>
        {!opened ? <HamburgerSVG /> : <CloseSVG />}
      </button>
    </div>
  )
}
