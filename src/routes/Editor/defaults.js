import {
  COMPOUND,
  DATE,
  SELECT,
  MEASUREMENT,
  MULTILANGUAGE,
  TEXT,
  NUMBER
} from './constants'

export const dictionary = {
  name: {
    type: TEXT
  },
  age: {
    type: NUMBER
  },
  date: {
    type: DATE,
    multivalue: true
  },
  email: {
    type: TEXT,
    multivalue: true
  },
  tag: {
    type: TEXT,
    multivalue: true
  },
  section: {
    type: COMPOUND,
    multivalue: true
  },
  role: {
    type: SELECT,
    options: [
      'admin',
      'manager',
      'user'
    ],
    multivalue: true
  },
  price: {
    type: MEASUREMENT,
    options: [
      'RON',
      'EUR',
      'USD'
    ],
    multivalue: true
  },
  description: {
    type: MULTILANGUAGE,
    multivalue: true
  },
  weight: {
    type: MEASUREMENT,
    options: [
      'kg',
      'gram',
      'tonne'
    ],
    multivalue: true
  }
}

export const value = {
  name: { $: '123' },
  age: { $: '123' },
  email: [
    { $: 'test2@gmail.com' },
    { $: 'test1@gmail.com' }
  ],
  role: [
    { $: 'admin' },
    { $: 'user' }
  ],
  section: {
    name: { $: '123' },
    date: { $: '2019-01-15' },
    price: { $: '123', '@uomValue': 'RON' },
    weight: { $: '123', '@uomValue': 'kg' },
    description: { $: 'this is a textarea', '@lang': 'en' }
  }
}