import React from 'react'
import isEmpty from 'lodash/isEmpty'
import ReactDOM from 'react-dom'
import { Alert } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { clearAlert, selectAlerts } from 'core/alerts'
import styles from './Alerts.module.scss'

export default function Alerts() {
  const alerts = useSelector(selectAlerts)
  if (isEmpty(alerts)) return null
  return ReactDOM.createPortal(
    <div className={styles.alerts}>
      {Object.values(alerts).map((alert) => (
        <AlertRow
          key={alert.id}
          alert={alert}
          onClose={clearAlert}
        />
      ))}
    </div>,
    document.getElementById('root')
  )
}

function AlertRow({ alert, onClose }) {
  const { id, type, message } = alert
  React.useEffect(() => {
    setTimeout(() => onClose(id), 8 * 1000)
  }, []) // eslint-disable-line

  return (
    <Alert
      role="alert"
      variant={type}
    >
      {message}
    </Alert>
  )
}
