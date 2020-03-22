import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'

import Page from 'layout/Page'
import DonutChart from './DonutChart'
import BarChart from './BarChart'
import DotChart from './DotChart'
import LineChart from './LineChart'
import Header from './Header'
import Toolbar from './Toolbar'
import styles from './index.module.scss'
import { selectCharts, initCharts } from './actions'

const initialData = {}
const initialSelected = {}
const initialBase = { x: 0, y: 0 }

const steps = { x: 6, y: 4 }
const width = 900
const height = 600

const routes = [
  { id: 'dot', path: '/dot', component: DotChart, x: true, y: true, z: true, base: true },
  { id: 'line', path: '/line', component: LineChart, x: true, y: true, base: true },
  { id: 'donut', path: '/donut', component: DonutChart, base: true, x: true, z: true },
  { id: 'bar', path: '/bar', component: BarChart, y: true, base: true }
]

export default function Charts({ location }) {
  React.useEffect(initCharts, [])
  const charts = useSelector(selectCharts)
  const {
    data = initialData,
    base = initialBase,
    selected = initialSelected
  } = charts || {}
  const currentRoute = routes
    .find(({ path }) => location.pathname.endsWith(path)) || {}

  return (
    <Page className={styles.charts} >
      <Header
        routes={routes}
        route={currentRoute}
      />
      <div className={styles.content}>
        <Toolbar
          route={currentRoute}
          selected={selected}
        />
        <Switch>
          {routes.map((chart) => (
            <Route
              key={chart.id}
              exact
              path={`/charts${chart.path}`}
              render={() => React.createElement(chart.component, {
                data,
                className: styles.chart,
                base,
                steps,
                width,
                height,
                selected
              })}
            />
          ))}
          <Redirect to={`/charts${routes[0].path}`} />
        </Switch>
      </div>
    </Page>
  )
}
