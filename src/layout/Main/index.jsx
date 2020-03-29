import React from 'react'
import { withRouter } from 'react-router'
import Header from './Header'
import Sidebar from './Sidebar'
import styles from './index.module.scss'

function Main({ children, routes, location }) {
  const currentRoute = routes.find(({ exact, path }) => (
    (exact && path === location.pathname) ||
    (!exact && location.pathname.startsWith(path))
  )) || {}

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <Sidebar
          routes={routes}
          route={currentRoute}
          className={styles.sidebar}
        />
        <div className={styles.rightContent}>
          {children}
          <footer className={styles.footer} />
        </div>
      </div>
      <Header
        className={styles.header}
        route={currentRoute}
      />
    </main>
  )
}

export default withRouter(Main)