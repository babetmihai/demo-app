import actions from 'store/actions'
import _ from 'lodash'

export const join = (...args) => args
  .filter(arg => !_.isNil(arg))
  .join('.')

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