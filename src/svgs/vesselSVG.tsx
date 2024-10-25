interface IVesselSVGProps {
  bgColour?: string
  width?:number
  height?: number
  strokeColour?: string
  strokeWidth?: number
  heading: number
  selected: boolean
}

export default function VesselSVG({ bgColour, width, height, strokeColour, strokeWidth, heading, selected }: IVesselSVGProps) {
  width = width ? width : 20
  height = height ? height : 20
  const defaultStrokeColour = "white"
  const defaultStrokeWidth = 0
  const defaultBgColour = "black"
  
  if (selected) {
    bgColour = "green"
    strokeColour = "green"
  } else {
    bgColour = bgColour ? bgColour : defaultBgColour
    strokeColour = strokeColour ? strokeColour : defaultStrokeColour
  }

  return (
    <svg style={{transform: `translate(${-width/2}px,${-height/2}px) rotate(${heading}deg)`}} width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.41896 10.3811L7.9929 9.97884L8.56685 10.3811L14.8209 14.7643L7.97251 1.13753C7.92465 1.22419 7.86857 1.32774 7.80451 1.4478C7.58923 1.85134 7.29852 2.41391 6.95662 3.08551C6.27357 4.42723 5.39562 6.18558 4.52759 7.93582C3.65988 9.6854 2.80341 11.4242 2.16378 12.7258C1.84399 13.3765 1.57846 13.9179 1.39289 14.2965L1.17773 14.7357L1.1629 14.766L7.41896 10.3811ZM8.12358 0.875783C8.12948 0.867612 8.13263 0.862751 8.13273 0.862353C8.13284 0.861954 8.12988 0.866044 8.12358 0.875783Z" fill={bgColour} stroke={strokeColour} strokeWidth={strokeWidth ? strokeWidth : defaultStrokeWidth}/>
    </svg>
  )
}
