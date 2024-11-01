import { useEffect, useState, useRef } from 'react'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'
interface ITimelineProps {
  timestamps: Date[]
  onChange(index: number): void
  timelineVal: number
  setTimelineVal: React.Dispatch<React.SetStateAction<number>>
}

export default function Timeline({ timestamps, onChange, timelineVal, setTimelineVal }: ITimelineProps) {
  // const timelineVal = useRef<number>(timestamps.length - 1)
  const { setSelectedVesselPath, selectedVesselmmsi, selectedVesselPath } = useVesselGuiContext()
  function handleChange(val: string) {
    try {
      const intVal: number = parseInt(val)
      setTimelineVal(intVal)
      onChange(intVal)
    } catch (e) {
      console.error(e)
    }
  }

  function closePath() {
    setSelectedVesselPath([])
  }

  useEffect(() => {
    setTimelineVal(0)
    console.log(timestamps[timelineVal])
    if (selectedVesselmmsi === undefined) setSelectedVesselPath([])
  }, [selectedVesselmmsi, setSelectedVesselPath])

  return selectedVesselPath.length !== 0 ? (
    <div className="bg-neutral_2 rounded-xl mx-4 px-4 py-2 shadow">
      <div className="w-full flex items-center relative">
        <p className="absolute left-1/2 transform -translate-x-1/2 font-bold text-center">
          Timestamp:{' '}
          {timelineVal && timestamps[timelineVal]
            ? timestamps[timelineVal].toISOString().replace('T', ' ').replace('Z', '').slice(0, 19)
            : 'unknown'}
        </p>
        <button
          onClick={closePath}
          className="ml-auto text-bold rounded-md bg-blue-600 hover:bg-blue-400 px-2 text-white"
        >
          Close
        </button>
      </div>
      <input
        className="w-full"
        type="range"
        id="timeline"
        min="0"
        max={`${timestamps.length - 1}`}
        value={`${timelineVal}`}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  ) : (
    <></>
  )
}
