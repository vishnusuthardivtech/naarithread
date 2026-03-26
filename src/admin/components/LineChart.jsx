import React from 'react'

const LineChart = ({
  data = [],
  width = 520,
  height = 260,
  strokeColor = '#d4af37',
  gridColor = 'rgba(255,255,255,0.08)',
}) => {
  const normalizedData = data.filter((point) => Number.isFinite(Number(point?.value)))

  if (normalizedData.length === 0) {
    return <div className="chart-container flex items-center justify-center text-text-secondary">No data</div>
  }

  const maxValue = Math.max(...normalizedData.map((point) => Number(point.value)), 1)
  const paddingX = 42
  const paddingTop = 20
  const paddingBottom = 34
  const innerWidth = width - paddingX * 2
  const innerHeight = height - paddingTop - paddingBottom

  const points = normalizedData.map((point, index) => {
    const x =
      normalizedData.length === 1 ? width / 2 : paddingX + (index / (normalizedData.length - 1)) * innerWidth
    const y = paddingTop + innerHeight - (Number(point.value) / maxValue) * innerHeight
    return [x, y]
  })

  const lineD = `M ${points.map(([x, y]) => `${x},${y}`).join(' L ')}`
  const areaD = `${lineD} L ${points.at(-1)[0]},${height - paddingBottom} L ${points[0][0]},${height - paddingBottom} Z`

  return (
    <div className="chart-container flex items-center justify-center">
      <svg className="chart-svg w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {[0, 0.25, 0.5, 0.75, 1].map((step) => {
          const y = paddingTop + innerHeight - step * innerHeight
          return (
            <g key={step}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke={gridColor} strokeWidth="1" />
              <text x={paddingX - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#a1a1aa">
                {Math.round(step * maxValue)}
              </text>
            </g>
          )
        })}

        {normalizedData.map((point, index) => {
          const x =
            normalizedData.length === 1 ? width / 2 : paddingX + (index / (normalizedData.length - 1)) * innerWidth
          return (
            <text key={point.label} x={x} y={height - 10} textAnchor="middle" fontSize="11" fill="#a1a1aa">
              {point.label}
            </text>
          )
        })}

        <path d={areaD} fill={strokeColor} fillOpacity="0.12" />
        <path d={lineD} stroke={strokeColor} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {points.map(([x, y], index) => (
          <g key={normalizedData[index].label}>
            <circle cx={x} cy={y} r="4.5" fill={strokeColor} stroke="#0f0f0f" strokeWidth="2" />
            <circle cx={x} cy={y} r="8" fill="none" stroke={strokeColor} strokeOpacity="0.22" />
          </g>
        ))}
      </svg>
    </div>
  )
}

export default LineChart
