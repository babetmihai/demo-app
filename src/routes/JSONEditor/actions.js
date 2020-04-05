import actions from 'store/actions'
import _ from 'lodash'
import { setAlertError, setAlertSuccess } from 'core/alerts'
import { t } from 'core/intl'

export const join = (...args) => args
  .filter(arg => !_.isNil(arg))
  .join('.')

export const TYPES = {
  INPUT: 'input',
  OBJECT: 'object',
  ARRAY: 'array'
}

export const VALUES = {
  [TYPES.INPUT]: '',
  [TYPES.OBJECT]: {},
  [TYPES.ARRAY]: []
}

const defaultValue = {
  name: 'M34234',
  other: [{ other: {} }],
  age: [123, {}],
  email: [
    'test2@gmail.com',
    'test1@gmail.com'
  ],
  role: [
    ['1231', 234],
    'admin',
    'user',
    { test: [1234, 234] }
  ],
  section: {
    name: '123',
    date: '2019-01-15',
    price: '123',
    weight: '123',
    description: 'this is a textarea'
  }
}

export const setSearch = _.debounce((search) => {
  actions.set('editor.search', search)
}, 700, { trailing: true })

export const filterValue = ({ search, key = '', value }) => {
  switch (true) {
    case (!_.isNumber(key) && key.toString().includes(search)): return value
    case (_.isArray(value)): {
      return value
        .map((item, index) => filterValue({ search, key: index, value: item }))
        .filter((item) => !_.isEmpty(item))
    }
    case (_.isPlainObject(value)): {
      return Object.entries(value).reduce((acc, [itemKey, item]) => {
        const newValue = filterValue({ search, key: itemKey, value: item })
        if (!_.isEmpty(newValue) || _.isString(newValue)) acc[itemKey] = newValue
        return acc
      }, {})
    }
    default: {
      return undefined
    }
  }
}

export const initEditor = ({ value = defaultValue, title } = {}) => {
  actions.set('editor', {
    value,
    initialValue: value,
    title
  })
}
export const selectEditor = () => actions.get('editor', {})

export const setValue = ({ path, value }) => {
  actions.set(join('editor.value', path), value)
}

export const downloadJSON = async ({ value, name }) => {
  try {
    const blob = new Blob([JSON.stringify(value, null, 2)], {
      type: 'application/json',
      name: name.toString()
    })
    if (typeof navigator !== 'undefined' && navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, value)
    } else {
      const element = document.createElement('a')
      element.setAttribute('href', URL.createObjectURL(blob))
      element.setAttribute('download', name)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  } catch (error) {
    setAlertError(t(error.message))
  }
}

export const uploadJSON = async ({ file }) => {
  if (!file) return
  try {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result)
        initEditor({ value: json, title: file.name })
        setAlertSuccess(t('file.uploaded.succesfully'))
      } catch (error) {
        setAlertError(t(error.message))
      }
    }
    reader.onerror = (error) => {
      setAlertError(t(error.message))
    }
    reader.readAsText(file)
  } catch (error) {
    setAlertError(t(error.message))
  }
}