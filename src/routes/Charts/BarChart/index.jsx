import React from 'react'
import * as d3 from 'd3'
import join from 'classnames'
import { roundExtent, extent } from 'core/d3'
import AxisY from '../AxisY'
import styles from './index.module.scss'
import { selectNode } from '../actions'

export default function BarChart({
  data,
  className,
  width,
  height,
  steps,
  base,
  selected
}) {
  const list = Object.values(data)
  const yExtent = roundExtent(extent(list.map(d => d.y)), base.y)

  const scaleTopColor = (d) => {
    return d3.scaleLinear()
      .domain([yExtent.min, yExtent.max])
      .range(['darkgreen', 'lime'])(Math.abs(base.y - d.y))
  }

  const scaleBottomColor = (d) => {
    return d3.scaleLinear()
      .domain([yExtent.min, yExtent.max])
      .range(['orange', 'brown'])(Math.abs(base.y - d.y))
  }

  const scaleY = (d) => {
    return d3.scaleLinear()
      .domain([yExtent.min, yExtent.max])
      .range([height, 1])(d.y)
  }

  const scaledBase = scaleY(base)

  return (
    <div className={join(styles.barChart, className)}>
      <svg
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${width} ${height}`}
      >
        <AxisY
          steps={steps.y}
          extent={yExtent}
          base={base.y}
          width={width}
          height={height}
        />
        {list.map((d, index) => {
          const rect = {}
          const text = {}

          const rectRatio = .8
          const length = Math.max(list.length, 5)
          const scaledY = scaleY(d)
          const isTop = scaledY < scaledBase

          rect.height = Math.abs(scaledBase - scaledY)
          rect.width = width / length * rectRatio

          rect.x = index * width / length + rect.width * (1 - rectRatio) / 2
          rect.y = isTop ? scaledY : scaledBase

          text.x = rect.x + rect.width / 2 - 7
          text.y = rect.y + (isTop ? -7 : 20) + (isTop ? 0 : rect.height)

          const fill = isTop
            ? scaleTopColor(d)
            : scaleBottomColor(d)

          return (
            <g key={d.id}>
              <rect
                width={rect.width}
                height={rect.height}
                x={rect.x}
                y={rect.y}
                fill={fill}
                className={styles.rect}
                opacity={.8}
                onClick={() => selectNode(d.id)}
              />
              {selected[d.id] &&
                <text
                  className={styles.text}
                  x={text.x}
                  y={text.y}
                >
                  {Math.round((d.y) * 100) / 100}
                </text>
              }
            </g>
          )
        })}
      </svg>
    </div>
  )
}