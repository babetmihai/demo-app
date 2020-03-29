import React from 'react'
import join from 'classnames'
import * as d3 from 'd3'
import { extent, roundExtent } from 'core/d3'
import LineTooltip from './LineTooltip'
import styles from './index.module.scss'
import { selectNode } from '../actions'

export default function DonutChart({ className, selected, data, width, height, base }) {
  const list = Object.values(data)
  const xExtent = roundExtent(extent(list.map(d => d.x)), base.x)
  const zExtent = roundExtent(extent(list.map(d => d.z)), base.z)

  const scaleX = (d) => d3.scaleLinear()
    .domain([xExtent.min, xExtent.max])
    .range([1, 100])(d.x)

  const scaleColor = (d) => d3.scaleLinear()
    .domain(d3.range(zExtent.min, zExtent.max, (zExtent.max - zExtent.min) / 4))
    .range(['darkgreen', 'green', 'lime', 'yellow'])(d.z)

  const pieData = d3.pie().sort(null).value((d) => scaleX(d))(list)
  const radius = Math.min(width, height) * .5
  const arc = d3.arc()
    .outerRadius(() => radius)
    .innerRadius(() => radius * .6)

  return (
    <div className={join(styles.donutChart, className)}>
      <svg
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${width} ${height}`}
      >
        <g className={styles.pie} transform={`translate(${width / 2},${height / 2})`}>
          {pieData.map((d) => {
            const color = scaleColor(d.data)
            const label = Math.round((d.data.x - base.x) * 100) / 100
            const { startAngle, endAngle } = d

            return (
              <g className={styles.arc} key={d.data.id}>
                <path
                  d={arc(d)}
                  fill={color}
                  strokeWidth={.5}
                  opacity={.8}
                  stroke={styles.primary}
                  className={styles.path}
                  onClick={() => selectNode(d.data.id)}
                />
                {selected[d.data.id] &&
                  <LineTooltip
                    radius={radius}
                    label={label}
                    color={styles.primary}
                    startAngle={startAngle}
                    endAngle={endAngle}
                  />
                }
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}