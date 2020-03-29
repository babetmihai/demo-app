import React from 'react'
import join from 'classnames'
import { Link } from 'react-router-dom'
import styles from './index.module.scss'

export default function Header({ routes, route }) {
  const { path: currentPath } = route
  return (
    <div className={styles.header}>
      {routes.map((chart) => {
        const active = chart.path === currentPath
        return (
          <Link
            key={chart.id}
            to={`/hierarchies${chart.path}`}
            className={join(
              styles.chartLink,
              active && styles.activeChartLink
            )}
          >
            <h3>{chart.id}</h3>
          </Link>
        )
      })}
    </div>
  )
}

