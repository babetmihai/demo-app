import React from 'react'
import join from 'classnames'
import * as d3 from 'd3'
import { roundExtent, extent } from 'core/d3'
import Axis2D from '../Axis2D'
import styles from './index.module.scss'
import { selectNode } from '../actions'

export default function LineChart({
  data,
  className,
  width,
  height,
  base,
  steps,
  selected
}) {
  const list = Object.values(data)

  const xExtent = roundExtent(extent(list.map(d => d.x)), base.x)
  const yExtent = roundExtent(extent(list.map(d => d.y)), base.y)
  const zExtent = roundExtent(extent(list.map(d => d.z)), base.z)

  const scaleX = (d) => {
    return d3.scaleLinear()
      .domain([xExtent.min, xExtent.max])
      .range([0, width])(d.x)
  }
  const scaleY = (d) => d3.scaleLinear()
    .domain([yExtent.min, yExtent.max])
    .range([height, 0])(d.y)

  const vmin = Math.min(width, height)
  const scaleRadius = (d) => d3.scaleLinear()
    .domain([zExtent.min, zExtent.max])
    .range([ vmin / 50, vmin / 20])(d.z)

  const scaleColor = (d) => d3.scaleLinear()
    .domain(d3.range(zExtent.min, zExtent.max, (zExtent.max - zExtent.min) / 4))
    .range(['darkgreen', 'green', 'lime', 'yellow'])(d.z)

  return (
    <div className={join(styles.dotChart, className)}>
      <svg
        preserveAspectRatio="xMidYMid meet"
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
        {list.map((d) => (
          <circle
            key={d.id}
            cx={scaleX(d)}
            cy={scaleY(d)}
            r={scaleRadius(d)}
            fill={scaleColor(d)}
            strokeWidth={selected[d.id] ? 2 : 0}
            stroke={styles.primary}
            className={styles.circle}
            onClick={() => selectNode(d.id)}
          />
        ))}
      </svg>
    </div>
  )
}