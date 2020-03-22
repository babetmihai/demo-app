import { createStore } from 'redux'
import get from 'lodash/get'
import setWith from 'lodash/setWith'
import isEmpty from 'lodash/isEmpty'
import debounce from 'lodash/debounce'
import reducer from './reducer'
import { DEFAULT_LOCALE } from 'core/intl'

const AUTH_PATH = 'auth'
const PERSISTENT_PATHS = [
  { path: AUTH_PATH, defaultValue: {} },
  { path: 'intl.locale', defaultValue: DEFAULT_LOCALE }
]

const state = {}
PERSISTENT_PATHS.forEach(({ path, defaultValue }) => {
  try {
    const value = JSON.parse(localStorage.getItem(path)) || defaultValue
    setWith(state, path, value, Object)
  } catch (error) {
    console.error(error.message) // eslint-disable-line
  }
})

const store = createStore(
  reducer,
  state,
  (global.__REDUX_DEVTOOLS_EXTENSION__)
    ? global.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined
)

const saveState = debounce(() => {
  const state = store.getState()
  PERSISTENT_PATHS.forEach(({ path }) => {
    const value = get(state, path)
    localStorage.setItem(path, JSON.stringify(value))
  })
}, 700, { trailing: true })

store.subscribe(() => {
  // delete auth instantly when logging out
  const auth = get(store.getState(), AUTH_PATH, {})
  if (isEmpty(auth)) localStorage.setItem(AUTH_PATH, JSON.stringify(auth))

  saveState()
})

export default store