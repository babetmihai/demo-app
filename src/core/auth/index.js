import actions from 'store/actions'
import firebase from 'core/firebase'
import { setAlertError, setAlertSuccess } from 'core/alerts'
import { hideModal } from 'core/modals'
import { t } from 'core/intl'
import photoURL from './user.png'

const mapUser = (user) => ({
  userId: user.uid,
  displayName: user.providerData[0].displayName || user.providerData[0].email,
  email: user.providerData[0].email,
  photoURL: user.providerData[0].photoURL || photoURL,
  authenticated: true
})

export const selectAuth = () => actions.get('auth', {})

export const googleLogin = async () => {
  try {
    actions.set('auth.redirecting', true)
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  } catch (error) {
    setAlertError(t(error.message))
  }
}

export const getRedirectResult = async () => {
  try {
    const { user } = await firebase.auth().getRedirectResult()
    if (user) {
      actions.set('auth', mapUser(user))
    }
  } catch (error) {
    setAlertError(t(error.message))
  } finally {
    actions.delete('auth.redirecting')
  }
}

export const passwordLoginRegister = async ({ email, password }) => {
  try {
    let created
    let response
    try {
      response = await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        created = true
        response = await firebase.auth().createUserWithEmailAndPassword(email, password)

      } else {
        throw error
      }
    }
    const { user } = response
    if (user) {
      if (user.emailVerified) {
        actions.set('auth', mapUser(user))
        hideModal()
      } else {
        await firebase.auth().signOut()
        if (created) {
          await user.sendEmailVerification({ url: window.location })
          setAlertSuccess(t('user.created.please.check.your.inbox'))
          hideModal()
        } else {
          setAlertError(t('please.check.your.inbox'))
        }
      }
    }
  } catch (error) {
    setAlertError(t(error.message))
  }
}

export const passwordReset = async ({ email }) => {
  try {
    await firebase.auth().sendPasswordResetEmail(email)
    setAlertSuccess(t('email.sent.succesfully'))
    hideModal()
  } catch (error) {
    setAlertError(t(error.message))
  }
}

export const logout = async () => {
  try {
    await firebase.auth().signOut()
    actions.delete('auth')
  } catch (error) {
    setAlertError(error.message)
  }
}