import actions from 'store/actions'
import _ from 'lodash'

export const swap = (array, i, j) => {
  const newArray = [...array]
  newArray[i] = array[j]
  newArray[j] = array[i]
  return newArray
}

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
    [
      '1231',
      234
    ],
    'admin',
    'user',
    {
      test: [1234, 234]
    }
  ],
  section: {
    name: '123',
    date: '2019-01-15',
    price: '123',
    weight: '123',
    description: 'this is a textarea'
  }
}

export const initEditor = () => {
  actions.set('editor.value', defaultValue)
  actions.set('editor.initialValue', defaultValue)
}
export const selectEditor = () => actions.get('editor', {})

export const setValue = ({ path, value }) => {
  actions.set(join('editor.value', path), value)
}

export const downloadJSON = async ({ value, name }) => {
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

export const uploadJSON = async ({ file }) => {
  try {
    const reader = new FileReader()
    reader.onload = (event) => {
      const json = JSON.parse(event.target.result)
      actions.set('editor.value', json)
    }
    reader.readAsText(file)
  } catch (err) {
    console.error(err)
  }
}