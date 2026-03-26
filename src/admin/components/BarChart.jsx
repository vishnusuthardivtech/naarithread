import React from 'react'

const BarChart = ({
  data = [],
  width = 420,
  height = 260,
  barColor = '#d4af37',
  gridColor = 'rgba(255,255,255,0.08)',
}) => {
  const normalizedData = data.filter((point) => Number.isFinite(Number(point?.value)))

  if (normalizedData.length === 0) {
    return <div className="chart-container flex items-center justify-center text-text-secondary">No data</div>
  }

  const maxValue = Math.max(...normalizedData.map((point) => Number(point.value)), 1)
  const paddingX = 28
  const paddingTop = 20
  const paddingBottom = 42
  const innerWidth = width - paddingX * 2
  const innerHeight = height - paddingTop - paddingBottom
  const slot = innerWidth / normalizedData.length
  const barWidth = Math.min(46, slot - 12)

  return (
    <div className="chart-container">
      <svg className="chart-svg w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {[0.25, 0.5, 0.75, 1].map((step) => {
          const y = paddingTop + innerHeight - step * innerHeight
          return (
            <g key={step}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke={gridColor} strokeWidth="1" />
              <text x={paddingX - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#a1a1aa">
                {Math.round(step * maxValue)}
              </text>
            </g>
          )
        })}

        {normalizedData.map((point, index) => {
          const value = Number(point.value)
          const barHeight = (value / maxValue) * innerHeight
          const x = paddingX + index * slot + (slot - barWidth) / 2
          const y = paddingTop + innerHeight - barHeight

          return (
            <g key={point.label}>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx="10" fill={barColor} fillOpacity="0.82" />
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="11" fill="#ffffff">
                {value}
              </text>
              <text x={x + barWidth / 2} y={height - 12} textAnchor="middle" fontSize="11" fill="#a1a1aa">
                {point.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default BarChart
