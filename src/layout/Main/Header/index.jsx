import React from 'react'
import join from 'classnames'
import { t } from 'core/intl'
import history from 'core/history'
import styles from './index.module.scss'
import { selectAuth } from 'core/auth'
import { useSelector } from 'react-redux'

import { showModal, AUTH_MODAL, LOGIN_MODAL } from 'core/modals'
import { Button } from 'react-bootstrap'

function Header({ route, className }) {
  const auth = useSelector(selectAuth)
  const { authenticated, photoURL, displayName } = auth
  const { path, id, icon } = route || {}
  const home = path === '/'
  return (
    <header className={join(styles.header, className)}>
      <div className={styles.left}>
        {!home &&
          <i
            style={{ cursor: 'pointer' }}
            onClick={() => history.push('/')}
          >
            keyboard_return
          </i>
        }
        <h1 className={styles.title}>{t(id)}</h1>
        {!home && <i>{icon}</i>}
      </div>
      <div className={styles.right}>
        {authenticated
          ? (
            <img
              className={styles.photo}
              alt={displayName}
              src={photoURL}
              onClick={() => showModal(AUTH_MODAL)}
            />
          ) : (
            <Button
              variant="light"
              onClick={() => showModal(LOGIN_MODAL)}
            >
              <i>people</i>
            </Button>
          )
        }
      </div>
    </header>
  )
}

export default Header