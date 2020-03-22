import React from 'react'
import * as d3 from 'd3'

export default function LineTooltip({
  radius,
  startAngle,
  endAngle,
  label,
  color
}) {
  const x = {}
  const y = {}
  const angle = (endAngle + startAngle ) / 2 - Math.PI / 2
  x.origin = radius * Math.cos(angle)
  y.origin = radius * Math.sin(angle)
  x.outward = x.origin * 1.15
  y.outward = y.origin * 1.15

  if (x.origin < 0 ) {
    x.edge = x.outward - 50
    y.edge = y.outward
    x.text = x.edge - 35
    y.text = y.edge + 5
  } else {
    x.edge = x.outward + 50
    y.edge = y.outward
    x.text = x.edge + 10
    y.text = y.edge + 5
  }

  const line = d3.path()
  line.moveTo(x.origin, y.origin)
  line.lineTo(x.outward, y.outward)
  line.lineTo(x.edge, y.edge)

  return (
    <g>
      <path
        d={line.toString()}
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity={.8}
      />
      <text
        x={x.text}
        y={y.text}
        fontSize="16"
      >
        {label}
      </text>
    </g>
  )
}