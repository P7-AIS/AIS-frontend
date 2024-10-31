interface IChevronProps {
  width?: number
  height?: number
  rotate?: number
}

export default function ChevronSVG({ width, height, rotate }: IChevronProps) {
  width = width ? width : 24
  height = height ? height : 24

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="currentColor"
      className={'bi bi-chevron-down' + (rotate ? ' rotate-' + rotate : '')}
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
      />
    </svg>
  )
}
