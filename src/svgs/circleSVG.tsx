interface ICircleSVGProps {
  bgColour?: string
  selected: boolean
  diameter?:number
}

export default function CircleSVG({ bgColour, selected, diameter }: ICircleSVGProps) {
  const defaultBgColour = "black"
  diameter = diameter ? diameter : 8
  
  if (selected) {
    bgColour = "green"
  } else {
    bgColour = bgColour ? bgColour : defaultBgColour
  }

  return (
    <svg style={{transform: `translate(${-diameter/2}px,${-diameter/2}px)`}} xmlns="http://www.w3.org/2000/svg" width={diameter} height={diameter} fill={bgColour} className="bi bi-circle-fill" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="8"/>
    </svg>
  )
}
