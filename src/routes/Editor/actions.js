import Promise from 'bluebird'
import messages from './messages'
import store from 'store/actions'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {
  initService,
  changeService,
  submitService,
  revertService,
  cancelChangeService,
  cancelAllChangeService,
  cancelSubmitService,
  cancelRevertService
} from './services'

import { COMPOUND, NUMBER } from './constants'

export const validateInput = ({ name, value = {}, dictionary }) => {
  const type = get(dictionary, `${name}.type`)
  const { $: inputValue = '' } = value
  if (type === NUMBER && isNaN(inputValue)) return 'nan'
  if (!inputValue) return 'noValue'
  if (inputValue.includes('err')) return 'hasError'
}

export const validateForm = ({ name, value, dictionary }) => {
  if (isArray(value)) {
    const error = [
      ...Object.keys(value).reduce((acc, index) => {
        const error = validateForm({
          name,
          value: value[index],
          dictionary
        })
        if (error) acc[index] = error
        return acc
      }, [])
    ]

    if (!isEmpty(error)) return error
    return undefined
  }
  const type = get(dictionary, `${name}.type`)
  if (!name || type === COMPOUND) {
    const error = Object.keys(value).reduce((acc, key) => {
      const error = validateForm({
        name: key,
        value: value[key],
        dictionary
      })
      if (error) acc[key] = error
      return acc
    }, {})
    if (!isEmpty(error)) return error
    return undefined
  }

  return validateInput({ name, value, dictionary })
}

export const formInit = () => {

  cancelAllChangeService()
  cancelSubmitService()
  cancelRevertService()
  return Promise.resolve()
    .then(() => initService())
    .then(({ value, dictionary }) => {
      store.set('formData', {
        value,
        dictionary: dictionary,
        initialValue: value,
        messages
      })
    })
    .catch(() => store.delete('formData'))
}

export const formChange = ({
  name,
  value,
  path,
  dictionary

}) => {
  cancelChangeService({ path })
  cancelSubmitService()
  cancelRevertService()
  return Promise.resolve()
    .then(() => store.set(`formData.value.${path}`, value))
    .then(() => store.set(`formData.loading.${path}`, true))
    .then(() => changeService({ path }))
    .then(() => {
      const inputError = validateForm({ name, value, dictionary })
      if (inputError) {
        const error = new Error()
        error.inputError = inputError
        throw error
      }
    })
    .then(() => store.delete(`formData.loading.${path}`))
    .then(() => store.delete(`formData.error.${path}`))
    .catch((error) => {
      if (error.canceled) return error
      store.delete(`formData.loading.${path}`)
      if (error.inputError) {
        store.set(`formData.error.${path}`, error.inputError)
      }
    })
}

export const formSubmit = ({
  value,
  dictionary
}) => {
  cancelAllChangeService()
  cancelSubmitService()
  cancelRevertService()
  return Promise.resolve()
    .then(() => store.set('formData.loading', true))
    .then(() => submitService())
    .then(() => {
      const formError = validateForm({ value, dictionary })
      if (formError) {
        const error = new Error()
        error.formError = formError
        throw error
      }
    })
    .then(() => store.set('formData.initialValue', value))
    .then(() => store.delete('formData.error'))
    .then(() => store.delete('formData.loading'))
    .catch((error) => {
      if (error.canceled) return error
      store.delete('formData.loading')
      if (error.formError) {
        store.set('formData.error', error.formError)
      } else {
        store.delete('formData.error')
      }
    })
}

export const formRevert = ({ initialValue }) => {
  cancelAllChangeService()
  cancelSubmitService()
  cancelRevertService()
  return Promise.resolve()
    .then(() => store.set('formData.loading', true))
    .then(() => revertService())
    .then(() => store.set('formData.value', initialValue))
    .then(() => store.delete('formData.error'))
    .then(() => store.delete('formData.loading'))
    .catch((error) => {
      if (!error.canceled) {
        store.delete('formData.loading')
        store.delete('formData.error')
      }
    })
}

export const formDownload = async ({ value, name }) => {
  try {
    const fileName = `${name}.json`
    const blob = new Blob([JSON.stringify(value, null, 2)], {
      type: 'application/json',
      name: fileName.toString()
    })
    if (typeof navigator !== 'undefined' && navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, value)
    } else {
      const element = document.createElement('a')
      element.setAttribute('href', URL.createObjectURL(blob))
      element.setAttribute('download', fileName)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  } catch (error) {
    console.log(error)
  }
}
