import { useEffect } from 'react'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import CloseSVG from '../svgs/closeSVG'
interface ITimelineProps {
  timestamps: Date[]
  onChange(index: number): void
  timelineVal: number
  setTimelineVal: React.Dispatch<React.SetStateAction<number>>
}

export default function Timeline({ timestamps, onChange, timelineVal, setTimelineVal }: ITimelineProps) {
  const { setSelectedVesselPath, selectedVesselmmsi, selectedVesselPath, setPathIsShown } = useVesselGuiContext()
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
    setPathIsShown(false)
  }

  useEffect(() => {
    setTimelineVal(0)
    if (selectedVesselmmsi === undefined) setSelectedVesselPath([])
    return () => {
      setSelectedVesselPath([])
    }
  }, [selectedVesselmmsi, setSelectedVesselPath, setTimelineVal])

  return selectedVesselPath.length !== 0 ? (
    <div className="bg-gray-700 text-white rounded-xl px-4 py-2 shadow max-w-[700px] w-full">
      <div className="w-full flex items-center relative">
        <p className="absolute left-1/2 transform -translate-x-1/2 font-bold text-center">
          Timestamp:{' '}
          {timelineVal && timestamps[timelineVal]
            ? timestamps[timelineVal].toISOString().replace('T', ' ').replace('Z', '').slice(0, 19)
            : 'unknown'}
        </p>
        <button onClick={closePath} className="ml-auto -mr-2">
          <CloseSVG />
        </button>
      </div>
      <input
        className="w-full mt-3 hover:cursor-pointer"
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
