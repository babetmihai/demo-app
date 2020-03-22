import 'normalize.css'
import 'index.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import * as serviceWorker from 'core/serviceWorker'
import { getRedirectResult } from 'core/auth'
import store from 'store'
import { initLocale } from 'core/intl'
import history from 'core/history'

import App from './App'

Promise.resolve()
  .then(() => initLocale())
  .then(() => getRedirectResult())
  .then(() => {
    ReactDOM.render((
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    ), document.getElementById('root'))
  })

serviceWorker.unregister()
