import React from 'react'
import join from 'classnames'
import * as d3 from 'd3'
import { roundExtent, extent } from 'core/d3'
import Axis2D from '../Axis2D'
import styles from './index.module.scss'

export default function LineChart({
  data,
  className,
  width,
  height,
  base,
  steps
}) {
  const list = Object.values(data)

  const xExtent = roundExtent(extent(list.map(d => d.x)), base.x)
  const yExtent = roundExtent(extent(list.map(d => d.y)), base.y)

  const scaleX = (d) => {
    return d3.scaleLinear()
      .domain([xExtent.min, xExtent.max])
      .range([0, width])(d.x)
  }
  const scaleY = (d) => d3.scaleLinear()
    .domain([yExtent.min, yExtent.max])
    .range([height, 0])(d.y)

  const sortedList = list.sort((first, second) => first.x - second.x)
  const line = d3.line()
    .x((d) => scaleX(d))
    .y((d) => scaleY(d))
    .curve(d3.curveMonotoneX)(sortedList)

  return (
    <div className={join(styles.lineChart, className)}>
      <svg
        preserveAspectRatio="xMidYMid meet"
        className={styles.container}
        viewBox={`0 0 ${width} ${height}`}
      >
        <Axis2D
          steps={steps}
          xExtent={xExtent}
          yExtent={yExtent}
          base={base}
          width={width}
          height={height}
        />
        <path
          d={line}
          stroke={styles.primary}
          strokeWidth={1.5}
          fill="none"
          opacity={.25}
        />
        {list.map((d) => (
          <circle
            key={d.id}
            cx={scaleX(d)}
            cy={scaleY(d)}
            r={2}
            fill={styles.primary}
            opacity={.5}
          />
        ))}
      </svg>
    </div>
  )
}