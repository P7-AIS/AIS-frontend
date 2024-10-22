import { useState } from 'react'
interface ITimelineProps {
  timestamps: Date[]
}

export default function Timeline({ timestamps }: ITimelineProps) {
  const [timelineVal, setTimelineVal] = useState<number | undefined>(undefined)
  function handleChange(val: string) {
    try {
      const intVal: number = parseInt(val)
      setTimelineVal(intVal)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      <p>Timeline value{timelineVal}</p>
      <input
        type="range"
        id="timeline"
        min="0"
        max={`${timestamps.length}`}
        value={`${timelineVal}`}
        onChange={(e) => handleChange(e.target.value)}
      ></input>
    </div>
  )
}
