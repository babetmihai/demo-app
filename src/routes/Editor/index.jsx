import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Form, Card, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap'
import _ from 'lodash'
import store from 'store/actions'
import Page from 'layout/Page'
import styles from './index.module.scss'

const joinPath = (...args) => args
  .filter(arg => !_.isNil(arg))
  .join('.')

class FormComponent extends PureComponent {

  render() {
    return (
      <Page
        loading={!value}
        className={styles.editor}
      >
        <Resolver
          label="editor"
          value={value}
        />
      </Page>
    )
  }
}

function Resolver({ label, path, value }) {
  switch (true) {
    case (_.isPlainObject(value)): {
      return (
        <ObjectValue
          label={label}
          value={value}
          path={path}
        />
      )
    }
    case (_.isArray(value)): {
      return (
        <ArrayValue
          label={label}
          value={value}
          path={path}
        />
      )
    }
    case (!!label): {
      return (
        <LabeledInput
          label={label}
          value={value}
          path={path}
        />
      )
    }
    default: {
      return (
        <Input
          label={label}
          value={value}
          path={path}
        />
      )
    }
  }
}

function ObjectValue({ label, path, value }) {
  return (
    <Card className={styles.objectValue}>
      <Card.Header className={styles.objectHeader}>
        <i>folder_open</i>
        <div className={styles.label}>{label}</div>
        <DropdownButton
          className={styles.dropdown}
          title=""
          variant="light"
        >
          <Dropdown.Item href="#">Action</Dropdown.Item>
          <Dropdown.Item href="#">Another action</Dropdown.Item>
          <Dropdown.Item href="#">Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#">Separated link</Dropdown.Item>
        </DropdownButton>
      </Card.Header>
      <div className={styles.content}>
        {Object.keys(value).map((id) => (
          <Resolver
            key={id}
            label={id}
            path={joinPath(path, id)}
            value={value[id]}
          />
        ))}
      </div>
    </Card>
  )
}

function ArrayValue({ label, path, value }) {
  return (
    <Card className={styles.arrayValue}>
      <Card.Header className={styles.arrayHeader}>
        <i>format_list_bulleted</i>
        <div className={styles.label}>{label}</div>
        <DropdownButton
          className={styles.dropdown}
          title=""
          variant="light"
        >
          <Dropdown.Item href="#">Action</Dropdown.Item>
          <Dropdown.Item href="#">Another action</Dropdown.Item>
          <Dropdown.Item href="#">Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#">Separated link</Dropdown.Item>
        </DropdownButton>
      </Card.Header>
      <div className={styles.content}>
        {Object.values(value).map((item, index) => (
          <Resolver
            key={index}
            path={joinPath(path, index)}
            value={item}
          />
        ))}
      </div>
    </Card>
  )
}

function LabeledInput({ label, path, value }) {
  return (
    <InputGroup className={styles.labeledInput}>
      <InputGroup.Prepend>
        <InputGroup.Text>
          {label}
        </InputGroup.Text>
      </InputGroup.Prepend>
      <Form.Control value={value} onChange={() => console.log(path)} />
      <DropdownButton
        className={styles.dropdown}
        as={InputGroup.Append}
        title=""
        variant="outline-info"
      >
        <Dropdown.Item href="#">Action</Dropdown.Item>
        <Dropdown.Item href="#">Another action</Dropdown.Item>
        <Dropdown.Item href="#">Something else here</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="#">Separated link</Dropdown.Item>
      </DropdownButton>
    </InputGroup>
  )
}

function Input({ label, path, value }) {
  return (
    <InputGroup className={styles.input}>
      <Form.Control value={value} onChange={() => console.log(path)} />
      <DropdownButton
        className={styles.dropdown}
        as={InputGroup.Append}
        title=""
        variant="outline-info"
      >
        <Dropdown.Item href="#">Action</Dropdown.Item>
        <Dropdown.Item href="#">Another action</Dropdown.Item>
        <Dropdown.Item href="#">Something else here</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="#">Separated link</Dropdown.Item>
      </DropdownButton>
    </InputGroup>
  )
}

export const value = {
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

export default connect(() => store.get('formData', {}))(FormComponent)
