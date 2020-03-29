import React from 'react'
import * as d3 from 'd3'
import styles from './index.module.scss'

export default function AxisY({
  extent,
  width,
  height,
  base,
  steps
}) {
  const scaleY = (dy) => {
    return d3.scaleLinear()
      .domain([extent.min, extent.max])
      .range([height, 1])(dy)
  }

  const getYPath = (dy) => {
    const path = d3.path()
    path.moveTo(0, scaleY(dy))
    path.lineTo(width, scaleY(dy))
    return path.toString()
  }

  const d3path = d3.path()
  d3path.moveTo(0, scaleY(extent.min))
  d3path.lineTo(0, scaleY(extent.max))
  const pathDescription = d3path.toString()

  const stepY = (extent.max - extent.min) / (2 * steps)
  const rangeYleft = d3.range(base - stepY, extent.min, -stepY)
  const rangeYright = d3.range(base + stepY, extent.max, stepY)
  const rangeY = [...rangeYleft, ...rangeYright]

  return (
    <g className={styles.axisY}>
      <path
        stroke={styles.primary}
        d={pathDescription}
        className={styles.path}
      />
      {rangeY.map((y, index) => (
        <g key={index}>
          <path
            stroke={styles.border}
            key={index}
            d={getYPath(y)}
          />
          <circle
            r={3}
            cx={0}
            cy={scaleY(y)}
          />
          <text
            x={-45}
            y={scaleY(y) + 5}
          >
            {Math.floor(y * 100) / 100}
          </text>
        </g>
      ))}
      <path
        stroke={styles.primary}
        d={getYPath(base)}
      />
      <circle
        r={3}
        cx={0}
        cy={scaleY(base)}
        fill={styles.primary}
      />
      <text
        x={-45}
        y={scaleY(base) + 5}
        fontWeight="bold"
      >
        {`${Math.floor(base * 100) / 100}`}
      </text>
    </g>
  )

}