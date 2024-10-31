interface IChevronProps {
  width?: number
  height?: number
  rotate?: number
}

export default function ChevronSVG({ width, height, rotate }: IChevronProps) {
  width = width ? width : 30
  height = height ? height : 30
  rotate = rotate ? rotate : 0
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ transform: `rotate(${rotate}deg)` }} height={height} viewBox="0 -960 960 960" width={width} fill="currentColor">
      <path d="M480-528 324-372q-11 11-28 11t-28-11q-11-11-11-28t11-28l184-184q12-12 28-12t28 12l184 184q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-528Z" />
    </svg>
  )
}
