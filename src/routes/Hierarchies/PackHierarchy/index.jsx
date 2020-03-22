import React from 'react'
import * as d3 from 'd3'
import join from 'classnames'
import { selectNode } from '../actions'
import { extent } from 'core/d3'
import styles from './index.module.scss'

export default function PackHierarchy({
  className,
  width,
  height,
  selected,
  data = {}
}) {
  const list = Object.values(data)
  if (list.length < 2) return null
  const hierarchy = d3.stratify()(list)
  const pack = d3.pack()
    .size([width, height])
    .padding(10)(
      d3.hierarchy(hierarchy).sum((d) => d.data.value)
    )
  const nodes = pack.descendants()

  const depthExtent = extent(nodes.map((node) => node.depth))
  const scaleColor = (d) => d3.scaleLinear()
    .domain(d3.range(
      depthExtent.min,
      depthExtent.max,
      (depthExtent.max - depthExtent.min) / 4
    ))
    .range(['darkgreen', 'green', 'lime', 'yellow'])(d.depth)

  return (
    <div className={join(styles.packHierarchy, className)}>
      <svg
        preserveAspectRatio="xMidYMid meet"
        className={styles.container}
        viewBox={`0 0 ${width} ${height}`}
      >
        {nodes.map((d) => {
          const id = d.data.id
          if (!d.parent) return null
          return (
            <circle
              className={join(
                styles.circle,
                selected[id] && styles.selected,
              )}
              key={id}
              cx={d.x}
              cy={d.y}
              r={d.r}
              fill={scaleColor(d)}
              onClick={() => selectNode(id)}
            />
          )
        })}
      </svg>
    </div>
  )
}