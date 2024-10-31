interface IFaviconProps {
  width?: number
  height?: number
}

export default function FaviconSVG({ width, height }: IFaviconProps) {
  width = width ? width : 30
  height = height ? height : 30

  return (
    <svg width={width} height={height} viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="57" height="57" rx="28.5" fill="url(#paint0_linear_162_12)" />
      <path
        d="M7.74562 18.6412C7.27801 18.9112 6.91852 19.1734 6.77375 19.75C6.4836 20.8998 7.17192 22.092 8.31277 22.4156L25.0066 30.1906L23.3935 48.5363C23.1034 49.6861 23.7923 50.8794 24.9325 51.2019C26.0734 51.5256 26.9119 50.6059 27.5223 49.7068L47.8508 18.7799C48.141 17.6301 47.452 16.4368 46.3118 16.1143C45.1716 15.7917 9.36356 18.255 9.36356 18.255C8.65788 18.3045 8.21426 18.3707 7.74562 18.6412Z"
        fill="white"
      />
      <defs>
        <linearGradient id="paint0_linear_162_12" x1="51.5" y1="2.5" x2="5" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0051FF" />
          <stop offset="1" stopColor="#00329E" />
        </linearGradient>
      </defs>
    </svg>
  )
}
