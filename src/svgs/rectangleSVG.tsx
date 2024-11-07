interface IRectangleProps {
  width?: number
  height?: number
}

export default function RectangleSVG({ width, height }: IRectangleProps) {
  width = width ? width : 32
  height = height ? height : 32

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="currentColor"
      className="bi bi-square"
      viewBox="0 0 16 16"
      stroke="currentColor"
      strokeWidth="0.3"
    >
      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
    </svg>
  )
}
