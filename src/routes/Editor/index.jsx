import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import store from 'store/actions'
import Page from 'layout/Page'
import styles from './index.module.scss'

class FormComponent extends PureComponent {

  render() {
    return (
      <Page
        loading={!value}
        className={styles.editor}
      >
        <Resolver value={value} />
      </Page>
    )
  }
}

function Resolver({ value }) {
  switch (true) {
    case (_.isPlainObject(value)): {
      return (
        <div>
          {Object.keys(value).map((id) => (
            <Resolver
              key={id}
              value={value[id]}
            />
          ))}
        </div>
      )
    }
    case (_.isArray(value)): {
      return (
        <div>
          {Object.values(value).map((item, index) => (
            <Resolver key={index} value={item} />
          ))}
        </div>
      )
    }
    default: {
      return (
        <div>
          {value}
        </div>
      )
    }
  }
}

export const value = {
  name: 'M34234',
  age: 123,
  email: [
    'test2@gmail.com',
    'test1@gmail.com'
  ],
  role: [
    'admin',
    'user'
  ],
  section: {
    name: '123',
    date: '2019-01-15',
    price: '123',
    weight: '123',
    description: 'this is a textarea'
  }
}

export default connect(() => store.get('formData', {}))(FormComponent)
