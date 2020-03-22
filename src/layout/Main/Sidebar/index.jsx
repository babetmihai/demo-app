import React from 'react'
import join from 'classnames'
import { Link } from 'react-router-dom'
import styles from './index.module.scss'
import { ReactComponent as GitHubIcon } from 'icons/github.svg'

export default function Sidebar({ route, routes, className }) {
  const { path: currentPath, github } = route
  return (
    <div className={join(styles.sidebar, className)}>
      <div className={styles.top}>
        {routes.map((route) => {
          const { path, icon, id } = route
          return (
            <Link
              key={id}
              disabled={path === currentPath}
              to={path}
              className="btn btn-light"
            >
              <i>{icon}</i>
            </Link>
          )
        })}
      </div>
      <div className={styles.bottom}>
        {github &&
          <a
            href={github}
            target="_blank"
            rel="noreferrer noopener"
            className={'btn btn-light'}
          >
            <GitHubIcon className={styles.github} />
          </a>
        }
      </div>
    </div>
  )
}
