import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Form, Card, InputGroup, DropdownButton, Dropdown, Button } from 'react-bootstrap'
import _ from 'lodash'
import { join, selectEditor, initEditor, setValue } from './actions'
import Page from 'layout/Page'
import styles from './index.module.scss'
import { t } from 'core/intl'

const swap = (array, i, j) => {
  const newArray = [...array]
  newArray[i] = array[j]
  newArray[j] = array[i]
  return newArray
}

const TYPES = {
  KEY: 'key',
  OBJECT: 'object',
  ARRAY: 'array'
}

const VALUES = {
  [TYPES.KEY]: '',
  [TYPES.OBJECT]: {},
  [TYPES.ARRAY]: []
}

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

function ObjectValue({ label, path, value, onDelete, onChange, onMoveUp, onMoveDown, ...props }) {
  const keys = Object.keys(value)
  const [adding, setAdding] = React.useState()
  const [newKey, setNewKey] = React.useState('')

  return (
    <Card className={styles.objectValue}>
      <Card.Header className={styles.header}>
        <Button variant="light" className={styles.info}>
          <i>folder_open</i>
        </Button>
        <div className={styles.label}>{label}</div>
        <DropdownButton
          className={styles.dropdown}
          title=""
          variant="light"
        >
          {onDelete &&
            <Dropdown.Item onClick={onDelete}>
              {t('delete')}
            </Dropdown.Item>
          }
          {onMoveUp &&
            <Dropdown.Item onClick={onMoveUp}>
              {t('move.up')}
            </Dropdown.Item>
          }
          {onMoveDown &&
            <Dropdown.Item onClick={onMoveDown}>
              {t('move.down')}
            </Dropdown.Item>
          }
          {!adding &&
            <Dropdown.Item onClick={() => setAdding(TYPES.KEY)}>
              {t('add.key')}
            </Dropdown.Item>
          }
          <Dropdown.Item href="#">Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#">Separated link</Dropdown.Item>
        </DropdownButton>
      </Card.Header>
      <div className={styles.content}>
        {keys.map((id, index) => (
          <Resolver
            {...props}
            key={id}
            label={id}
            path={join(path, id)}
            value={value[id]}
            onDelete={() => setValue({ path: join(path, id) })}
            onMoveUp={index > 0
              ? () => setValue({
                path,
                value: swap(keys, index, index - 1)
                  .reduce((acc, key) => {
                    acc[key] = value[key]
                    return acc
                  }, {})
              })
              : undefined
            }
            onMoveDown={(index < keys.length - 1)
              ? () => setValue({
                path,
                value: swap(keys, index + 1, index)
                  .reduce((acc, key) => {
                    acc[key] = value[key]
                    return acc
                  }, {})
              })
              : undefined
            }
            onChange={onChange}
          />
        ))}
        {adding &&
          <InputGroup className={styles.newKey}>
            <Form.Control
              autoFocus
              value={newKey}
              className={styles.keyInput}
              onChange={(event) => setNewKey(event.target.value)}
            />
            <Form.Control
              as="select"
              value={adding}
              className={styles.keySelect}
              onChange={(event) => setAdding(event.target.value)}
            >
              <option value={TYPES.KEY}>{TYPES.KEY}</option>
              <option value={TYPES.ARRAY}>{TYPES.ARRAY}</option>
              <option value={TYPES.OBJECT}>{TYPES.OBJECT}</option>
            </Form.Control>

            <InputGroup.Append>
              <Button
                variant="outline-info"
                className={styles.iconBtn}
                onClick={() => {
                  setNewKey('')
                  setAdding(undefined)
                }}
              >
                <i>cancel</i>
              </Button>
              <Button
                disabled={!newKey}
                onClick={() => {
                  setValue({ path: join(path, newKey), value: VALUES[adding] })
                  setNewKey('')
                  setAdding(undefined)
                }}
                variant="outline-info"
                className={styles.iconBtn}
              >
                <i>save</i>
              </Button>
            </InputGroup.Append>
          </InputGroup>
        }
      </div>
    </Card>
  )
}

function ArrayValue({ label, path, value, onDelete, onChange, onMoveUp, onMoveDown, ...props }) {
  const [adding, setAdding] = React.useState()
  return (
    <Card className={styles.arrayValue}>
      <Card.Header className={styles.header}>
        <Button variant="light" className={styles.info}>
          <i>format_list_bulleted</i>
        </Button>
        <div className={styles.label}>{label}</div>
        <DropdownButton
          className={styles.dropdown}
          title=""
          variant="light"
        >
          {onDelete &&
            <Dropdown.Item onClick={onDelete}>
              {t('delete')}
            </Dropdown.Item>
          }
          {onMoveUp &&
            <Dropdown.Item onClick={onMoveUp}>
              {t('move.up')}
            </Dropdown.Item>
          }
          {onMoveDown &&
            <Dropdown.Item onClick={onMoveDown}>
              {t('move.down')}
            </Dropdown.Item>
          }
          {!adding &&
            <Dropdown.Item onClick={() => setAdding(TYPES.KEY)}>
              {t('add.item')}
            </Dropdown.Item>
          }
          <Dropdown.Item href="#">Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#">Separated link</Dropdown.Item>
        </DropdownButton>
      </Card.Header>
      <div className={styles.content}>
        {value.map((item, index) => (
          <Resolver
            {...props}
            key={index}
            path={join(path, index)}
            value={item}
            onMoveUp={index > 0
              ? () => setValue({ path, value: swap(value, index, index - 1) })
              : undefined
            }
            onMoveDown={(index < value.length - 1)
              ? () => setValue({ path, value: swap(value, index, index + 1) })
              : undefined
            }
            onChange={onChange}
            onDelete={() => setValue({ path, value: value.filter((i) => i !== item) })}
          />
        ))}
        {adding &&
          <InputGroup className={styles.newKey}>
            <Form.Control
              as="select"
              value={adding}
              className={styles.keySelect}
              onChange={(event) => setAdding(event.target.value)}
            >
              <option value={TYPES.KEY}>{TYPES.KEY}</option>
              <option value={TYPES.ARRAY}>{TYPES.ARRAY}</option>
              <option value={TYPES.OBJECT}>{TYPES.OBJECT}</option>
            </Form.Control>

            <InputGroup.Append>
              <Button
                variant="outline-info"
                className={styles.iconBtn}
                onClick={() => setAdding(undefined)}
              >
                <i>cancel</i>
              </Button>
              <Button
                onClick={() => {
                  setValue({ path, value: [...value, VALUES[adding]] })
                  setAdding(undefined)
                }}
                variant="outline-info"
                className={styles.iconBtn}
              >
                <i>save</i>
              </Button>
            </InputGroup.Append>
          </InputGroup>
        }
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
    const { label, onDelete, onMoveUp, onMoveDown } = this.props
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
          {onMoveUp &&
            <Dropdown.Item onClick={onMoveUp}>
              {t('move.up')}
            </Dropdown.Item>
          }
          {onMoveDown &&
            <Dropdown.Item onClick={onMoveDown}>
              {t('move.down')}
            </Dropdown.Item>
          }
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
