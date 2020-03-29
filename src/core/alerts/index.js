import actions from 'store/actions'
import hash from 'object-hash'

export const ALERT_ERROR = 'danger'
export const ALERT_SUCCESS = 'success'

export const selectAlerts = () => actions.get('alerts', {})

export const setAlertError = (message) => {
  const id = hash(message)
  return actions.set(`alerts.${id}`, { id, type: ALERT_ERROR, message })
}

export const setAlertSuccess = (message) => {
  const id = hash(message)
  return actions.set(`alerts.${id}`, { id, type: ALERT_SUCCESS, message })
}

export const clearAlert = (id) => actions.delete(`alerts.${id}`)
export const clearAllAlerts = () => actions.delete('alerts')
