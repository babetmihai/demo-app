import actions from 'store/actions'
import AuthModal from 'core/auth/components/AuthModal'
import LoginModal from 'core/auth/components/LoginModal'

export const AUTH_MODAL = 'auth-modal'
export const LOGIN_MODAL = 'login-modal'

export const MODALS = {
  [AUTH_MODAL]: AuthModal,
  [LOGIN_MODAL]: LoginModal
}

export const showModal = (type, props) => actions.set('modal', { type, ...props })
export const hideModal = () => actions.delete('modal')
export const selectModal = () => actions.get('modal', {})