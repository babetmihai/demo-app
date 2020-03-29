import capitalize from 'lodash/capitalize'
import get from 'lodash/get'
import actions from 'store/actions'
import moment from 'moment'
import DEFAULT_MESSAGES from './messages/en.json'

export const LOCALE_LIST = ['en', 'de', 'es']
export const DEFAULT_LOCALE = 'en'

export const initLocale = async () => {
  let locale = navigator.language.substr(0, 2)
  if (!LOCALE_LIST.includes(locale)) locale = DEFAULT_LOCALE

  if (locale === 'de') await import('moment/locale/de')
  if (locale === 'es') await import('moment/locale/es')
  moment.locale(locale)

  const messages = await import(`./messages/${locale}.json`)
    .then(({ default: messages }) => messages)
    .catch(() => DEFAULT_MESSAGES)

  actions.set('intl', {
    locale,
    messages: {
      ...DEFAULT_MESSAGES,
      ...messages
    } })
}

export const selectLocale = () => actions.get('intl.locale')

const formatId = (id) => capitalize(id.split('.').join(' '))
const replaceParams = (message, params) => message.replace(/\{(.+?)\}/g, (_, key) => get(params, key.trim(), ''))

export const t = (id, params, defaultMessage = '') => {
  if (!id) return ''
  const messages = actions.get('intl.messages', {})
  let message = messages[id] || defaultMessage
  if (params && message) message = replaceParams(message, params)
  if (!message) message = formatId(id) || ''
  return message
}

export default actions