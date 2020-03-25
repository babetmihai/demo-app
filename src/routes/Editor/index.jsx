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
            <Dropdown.Item
              onClick={onDelete}
            >
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
      </Card.Header>
      <div className={styles.content}>
        {Object.keys(value).map((id, index) => (
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
                value: swap(Object.keys(value), index, index - 1)
                  .reduce((acc, key) => {
                    acc[key] = value[key]
                    return acc
                  }, {})
              })
              : undefined
            }
            onMoveDown={(index < Object.keys(value).length - 1)
              ? () => setValue({
                path,
                value: swap(Object.keys(value), index + 1, index)
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
      </div>
    </Card>
  )
}

function ArrayValue({ label, path, value, onDelete, onChange, onMoveUp, onMoveDown, ...props }) {
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
