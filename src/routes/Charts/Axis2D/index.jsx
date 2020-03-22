import React from 'react'
import * as d3 from 'd3'
import styles from './index.module.scss'

export default function Axis(props) {

  const {
    xExtent,
    yExtent,
    base,
    steps,
    width,
    height
  } = props

  const scaleX = (dx) => {
    return d3.scaleLinear()
      .domain([xExtent.min, xExtent.max])
      .range([0, width])(dx)
  }

  const scaleY = (dy) => {
    return d3.scaleLinear()
      .domain([yExtent.min, yExtent.max])
      .range([height, 0])(dy)
  }

  const getXPath = (dx) => {
    const path = d3.path()
    path.moveTo(scaleX(dx), scaleY(yExtent.min))
    path.lineTo(scaleX(dx), scaleY(yExtent.max))
    return path.toString()
  }

  const getYPath = (dy) => {
    const path = d3.path()
    path.moveTo(scaleX(xExtent.min), scaleY(dy))
    path.lineTo(scaleX(xExtent.max), scaleY(dy))
    return path.toString()
  }

  const stepX = Math.floor((xExtent.max - xExtent.min) / steps.x)
  const rangeXleft = d3.range(base.x, xExtent.min, -stepX)
  const rangeXright = d3.range(base.x, xExtent.max, stepX)
  const rangeX = [...rangeXleft, ...rangeXright]

  const stepY = Math.floor((yExtent.max - yExtent.min) / steps.y)
  const rangeYleft = d3.range(base.y, yExtent.min, -stepY)
  const rangeYright = d3.range(base.y, yExtent.max, stepY)
  const rangeY = [...rangeYleft, ...rangeYright]

  return (
    <g className={styles.axis2d}>
      {rangeX.map((dx, index) => (
        <g key={index}>
          <path
            stroke={styles.border}
            key={index}
            d={getXPath(dx)}
          />
          <circle
            r={3}
            cx={scaleX(dx)}
            cy={scaleY(base.y)}
          />
          {dx !== base.x &&
            <text
              x={scaleX(dx) - 10}
              y={scaleY(base.y) + 20}
            >
              {Math.floor(dx * 100) / 100}
            </text>
          }
        </g>
      ))}
      {rangeY.map((dy, index) => (
        <g key={index}>
          <path
            stroke={styles.border}
            key={index}
            d={getYPath(dy)}
          />
          <circle
            r={3}
            cx={scaleX(base.x)}
            cy={scaleY(dy)}
          />
          {dy !== base.y &&
            <text
              x={scaleX(base.x) - 35}
              y={scaleY(dy) + 5}
            >
              {Math.floor(dy * 100) / 100}
            </text>
          }

        </g>
      ))}
      <path
        stroke={styles.primary}
        d={getYPath(base.y)}
      />
      <path
        stroke={styles.primary}
        d={getXPath(base.x)}
      />
      <circle
        r={3}
        cx={scaleX(base.x)}
        cy={scaleY(base.y)}
      />
      <text
        x={scaleX(base.x) - 35}
        y={scaleY(base.y) + 20}
      >
        {`${Math.floor(base.x * 100) / 100}, ${Math.floor(base.y * 100) / 100}`}
      </text>
    </g>
  )
}