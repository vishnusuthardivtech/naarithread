import React from 'react'

const DEFAULT_COLORS = ['#d4af37', '#10b981', '#ef4444', '#f59e0b']

const PieChart = ({ data = [], width = 220, height = 220, colors = DEFAULT_COLORS }) => {
  const normalizedData = data.filter((slice) => Number(slice?.value) > 0)
  const total = normalizedData.reduce((sum, slice) => sum + Number(slice.value), 0)

  if (normalizedData.length === 0 || total <= 0) {
    return <div className="chart-container flex items-center justify-center text-text-secondary">No data</div>
  }

  const radius = 78
  const center = width / 2
  let currentAngle = -Math.PI / 2

  const slices = normalizedData.map((slice, index) => {
    const angle = (Number(slice.value) / total) * 2 * Math.PI
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const startX = center + radius * Math.cos(startAngle)
    const startY = center + radius * Math.sin(startAngle)
    const endX = center + radius * Math.cos(endAngle)
    const endY = center + radius * Math.sin(endAngle)
    const largeArcFlag = angle > Math.PI ? 1 : 0

    return {
      ...slice,
      color: colors[index % colors.length],
      percent: Math.round((Number(slice.value) / total) * 100),
      d: `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`,
    }
  })

  return (
    <div className="pie-chart-layout">
      <div className="pie-chart-visual">
        <svg className="pie-chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          {slices.map((slice) => (
            <path key={slice.label} d={slice.d} fill={slice.color} stroke="#0f0f0f" strokeWidth="2" />
          ))}

          <circle cx={center} cy={center} r="42" fill="#111111" />
          <text x={center} y={center - 2} textAnchor="middle" fontSize="24" fontWeight="700" fill="#ffffff">
            {total}
          </text>
          <text x={center} y={center + 22} textAnchor="middle" fontSize="12" fill="#a1a1aa">
            Total
          </text>
        </svg>
      </div>

      <div className="pie-chart-legend">
        {slices.map((slice) => (
          <div key={slice.label} className="pie-chart-legend-item">
            <span className="pie-chart-legend-dot" style={{ backgroundColor: slice.color }} />
            <span className="pie-chart-legend-label">{slice.label}</span>
            <span className="pie-chart-legend-value">{slice.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PieChart
