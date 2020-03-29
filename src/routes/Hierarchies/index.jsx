import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import { selectHierarchies, initHierarchy } from './actions'
import Page from 'layout/Page'

import PackHierarchy from './PackHierarchy'
import TreeHierarchy from './TreeHierarchy'
import Header from './Header'
import Toolbar from './Toolbar'
import styles from './index.module.scss'

const initialData = {}
const initialSelected = {}
const initialBase = { x: 0, y: 0 }

const steps = { x: 6, y: 4 }
const width = 900
const height = 600

const routes = [
  { id: 'tree', path: '/tree', component: TreeHierarchy },
  { id: 'pack', path: '/pack', component: PackHierarchy, value: true }
]

export default function Hierarchies({ location }) {
  React.useEffect(initHierarchy, [])
  const hierarchies = useSelector(selectHierarchies)
  const {
    data = initialData,
    base = initialBase,
    selected = initialSelected
  } = hierarchies || {}
  const currentRoute = routes
    .find(({ path }) => location.pathname.endsWith(path)) || {}

  return (
    <Page className={styles.hierarchies} >
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
              path={`/hierarchies${chart.path}`}
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
          <Redirect to={`/hierarchies${routes[0].path}`} />
        </Switch>
      </div>
    </Page>
  )
}