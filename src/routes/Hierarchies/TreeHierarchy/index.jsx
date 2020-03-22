import React from 'react'
import * as d3 from 'd3'
import join from 'classnames'
import { extent } from 'core/d3'
import styles from './index.module.scss'
import { selectNode } from '../actions'

export default function TreeHierarchy({
  className,
  width,
  height,
  selected,
  data = {}
}) {
  const list = Object.values(data)
  if (list.length < 2) return null

  const hierarchy = d3.stratify()(list)
  const tree = d3.cluster().size([width, height])(d3.hierarchy(hierarchy).sum(() => 1))

  const nodes = tree.descendants()
  const links = tree.links()

  const depthExtent = extent(nodes.map((node) => node.depth))
  const valueExtent = extent(nodes.map((node) => node.value))

  const scaleColor = (d) => d3.scaleLinear()
    .domain(d3.range(
      depthExtent.min,
      depthExtent.max,
      (depthExtent.max - depthExtent.min) / 4
    ))
    .range(['darkgreen', 'green', 'lime', 'yellow'])(d.depth)

  return (
    <div className={join(styles.treeHierarchy, className)}>
      <svg
        preserveAspectRatio="xMidYMid meet"
        className={styles.container}
        viewBox={`0 0 ${width} ${height}`}
      >
        {links.map((d, index) => {
          return (
            <line
              key={index}
              stroke={styles.border}
              strokeWidth={1}
              x1={d.source.x}
              y1={d.source.y}
              x2={d.target.x}
              y2={d.target.y}
            />
          )
        })}
        {nodes.map((d) => {
          const id = d.data.id
          const radius = (
            Math.min(width, height) /
            Math.min(250, Math.max(nodes.length, 50)) *
            Math.E ** (d.value / valueExtent.max) *
            (selected[id] ? 1.1 : 1)
          )

          return (
            <circle
              className={join(
                styles.circle,
                selected[id] && styles.selected,
              )}
              key={id}
              cx={d.x}
              cy={d.y}
              r={radius}
              fill={scaleColor(d)}
              onClick={() => selectNode(id)}
            />
          )
        })}
      </svg>
    </div>
  )
}