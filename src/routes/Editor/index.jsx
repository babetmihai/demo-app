import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Form, Card, InputGroup, DropdownButton, Dropdown, Button } from 'react-bootstrap'
import _ from 'lodash'
import { selectEditor, initEditor, setValue } from './actions'
import Page from 'layout/Page'
import styles from './index.module.scss'
import { t } from 'core/intl'

const joinPath = (...args) => args
  .filter(arg => !_.isNil(arg))
  .join('.')

class FormComponent extends PureComponent {

  componentDidMount() {
    const { value } = this.props
    if (!value) initEditor()
  }

  render() {
    const { value } = this.props
    return (
      <Page
        loading={!value}
        className={styles.editor}
      >
        <Resolver
          onChange={setValue}
          label="editor"
          value={value}
        />
      </Page>
    )
  }
}

function Resolver(props) {
  const { value } = props
  switch (true) {
    case (_.isPlainObject(value)): return <ObjectValue {...props} />
    case (_.isArray(value)): return <ArrayValue {...props} />
    case (!_.isNil(value)): return <Input {...props} />
    default: return null
  }
}

function ObjectValue({ label, path, value, onDelete, onChange, ...props }) {
  return (
    <Card className={styles.objectValue}>
      <Card.Header className={styles.header}>
        <Button variant="light" className={styles.info}><i>folder_open</i></Button>
        <div className={styles.label}>{label}</div>
        <DropdownButton
          className={styles.dropdown}
          title=""
          variant="light"
        >
          {onDelete &&
            <Dropdown.Item
              onClick={onDelete}
            >
              {t('delete')}
            </Dropdown.Item>
          }
          <Dropdown.Item href="#">Another action</Dropdown.Item>
          <Dropdown.Item href="#">Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#">Separated link</Dropdown.Item>
        </DropdownButton>
      </Card.Header>
      <div className={styles.content}>
        {Object.keys(value).map((id) => (
          <Resolver
            {...props}
            key={id}
            label={id}
            path={joinPath(path, id)}
            value={value[id]}
            onDelete={() => setValue({ path: joinPath(path, id) })}
            onChange={onChange}
          />
        ))}
      </div>
    </Card>
  )
}

function ArrayValue({ label, path, value, onDelete, onChange, ...props }) {
  return (
    <Card className={styles.arrayValue}>
      <Card.Header className={styles.header}>
        <Button variant="light" className={styles.info}><i>format_list_bulleted</i></Button>
        <div className={styles.label}>{label}</div>
        <DropdownButton
          className={styles.dropdown}
          title=""
          variant="light"
        >
          {path &&
            <Dropdown.Item onClick={onDelete}>
              {t('delete')}
            </Dropdown.Item>
          }
          <Dropdown.Item href="#">Another action</Dropdown.Item>
          <Dropdown.Item href="#">Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#">Separated link</Dropdown.Item>
        </DropdownButton>
      </Card.Header>
      <div className={styles.content}>
        {Object.values(value).map((item, index) => (
          <Resolver
            {...props}
            key={index}
            path={joinPath(path, index)}
            value={item}
            onChange={onChange}
            onDelete={() => setValue({ path, value: value.filter((i) => i !== item) })}
          />
        ))}
      </div>
    </Card>
  )
}

class Input extends PureComponent {

  editing = false
  state = { value: '' }

  componentDidMount() {
    const { value } = this.props
    this.setState({ value })
  }

  componentDidUpdate() {
    const { value } = this.props
    if (!this.editing) this.setState({ value })
  }

  render() {
    const { label, onDelete } = this.props
    const { value } = this.state

    return (
      <InputGroup className={styles.input}>
        {label &&
          <InputGroup.Prepend>
            <InputGroup.Text>
              {label}
            </InputGroup.Text>
          </InputGroup.Prepend>
        }
        <Form.Control
          value={value}
          onChange={this.handleChange}
        />
        <DropdownButton
          className={styles.dropdown}
          as={InputGroup.Append}
          title=""
          variant="outline-info"
        >
          {onDelete &&
            <Dropdown.Item onClick={onDelete}>
              {t('delete')}
            </Dropdown.Item>
          }
          <Dropdown.Item href="#">Another action</Dropdown.Item>
          <Dropdown.Item href="#">Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#">Separated link</Dropdown.Item>
        </DropdownButton>
      </InputGroup>
    )
  }

  handleChange = (event) => {
    const { path } = this.props
    const newValue = event.target.value
    this.editing = true
    this.setState({ value: newValue }, () => this.setValue({ value: newValue, path }))
  }

  setValue = _.debounce((...args) => {
    const { onChange } = this.props
    onChange && onChange(...args)
    this.editing = false
  }, 700, { trailing: true })
}

export default connect(selectEditor)(FormComponent)
