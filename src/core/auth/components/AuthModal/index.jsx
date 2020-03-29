import React from 'react'
import { t } from 'core/intl'
import { Button, Modal } from 'react-bootstrap'

import { selectAuth, logout } from 'core/auth'
import { useSelector } from 'react-redux'
import { hideModal } from 'core/modals'
import styles from './index.module.scss'

export default function AuthModal() {
  const auth = useSelector(selectAuth)
  const { photoURL, displayName, email } = auth
  return (
    <Modal
      show
      size="md"
      onHide={hideModal}
    >
      <Modal.Body className={styles.body}>
        <img
          className={styles.photo}
          alt={displayName}
          src={photoURL}
        />
        <h2>{displayName}</h2>
        <h5>{email}</h5>
      </Modal.Body>
      <Modal.Footer className={styles.footer}>
        <Button
          size="lg"
          variant="light"
          onClick={() => {
            hideModal()
            logout()
          }}
        >
          {t('sign.out')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
