import { useState } from 'react'
interface ITimelineProps {
  timestamps: Date[]
}

export default function Timeline({ timestamps }: ITimelineProps) {
  const [timelineVal, setTimelineVal] = useState<number>(timestamps.length-1)
  function handleChange(val: string) {
    try {
      const intVal: number = parseInt(val)
      setTimelineVal(intVal)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="bg-neutral_2 rounded-xl mx-4 px-4 shadow">
      <p className="text-center font-bold">Timestamp: {timelineVal ? timestamps[timelineVal].toISOString() : "unknown"}</p>
      <input
        className="w-full"
        type="range"
        id="timeline"
        min="0"
        max={`${timestamps.length-1}`}
        value={`${timelineVal}`}
        onChange={(e) => handleChange(e.target.value)}
      ></input>
    </div>
  )
}
