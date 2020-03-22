import React, { lazy, Suspense, Fragment } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Main from 'layout/Main'
import Page from 'layout/Page'
import Alerts from 'core/alerts/components/Alerts'
import Modals from 'core/modals/components/Modals'

const routes = [
  {
    id: 'home',
    path: '/',
    component: lazy(() => import('routes/Home')),
    icon: 'home',
    exact: true,
    github: 'https://github.com/babetmihai/babet-mihai'
  },
  {
    id: 'charts',
    path: '/charts',
    component: lazy(() => import('routes/Charts')),
    icon: 'pie_chart',
    github: 'https://github.com/babetmihai/babet-mihai/tree/master/src/routes/Charts'
  },
  {
    id: 'hierarchies',
    path: '/hierarchies',
    component: lazy(() => import('routes/Hierarchies')),
    icon: 'bubble_chart',
    github: 'https://github.com/babetmihai/babet-mihai/tree/master/src/routes/Hierarchies'
  },
  {
    id: 'timeline',
    path: '/timeline',
    component: lazy(() => import('routes/Timeline')),
    icon: 'view_list',
    github: 'https://github.com/babetmihai/babet-mihai/tree/master/src/routes/Timeline'
  },
  {
    id: 'editor',
    path: '/editor',
    component: lazy(() => import('routes/Editor')),
    icon: 'edit',
    github: 'https://github.com/babetmihai/babet-mihai/tree/master/src/routes/Editor'
  }
]

export default function App() {
  return (
    <Fragment>
      <Main routes={routes}>
        <Suspense fallback={<Page loading />}>
          <Switch>
            {routes.map((route) => {
              const { id, path, component, icon, exact } = route
              return (
                <Route
                  key={id}
                  exact={exact}
                  path={path}
                  render={(props) => React.createElement(component, {
                    ...props,
                    id,
                    icon,
                    routes
                  })}
                />
              )
            })}
            <Redirect to="/" />
          </Switch>
        </Suspense>
      </Main>
      <Modals />
      <Alerts />
    </Fragment>
  )
}
