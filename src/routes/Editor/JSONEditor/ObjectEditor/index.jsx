import React from 'react'
import _ from 'lodash'
import { t } from 'core/intl'
import { join, swap, TYPES, VALUES } from '../../actions'
import {
  Form,
  Card,
  InputGroup,
  DropdownButton,
  Dropdown,
  Button
} from 'react-bootstrap'
import Resolver from '../../JSONEditor'
import styles from './index.module.scss'

export default function ObjectEditor({
  label,
  path,
  value,
  initialValue,
  onDelete,
  onChange,
  onMoveUp,
  onMoveDown,
  ...props
}) {
  const keys = Object.keys(value)
  const [adding, setAdding] = React.useState()
  const [newKey, setNewKey] = React.useState('')
  const canRevert = !_.isNil(initialValue) && initialValue !== value
  const options = [
    onDelete && (
      <Dropdown.Item key="delete" onClick={onDelete}>
        {t('delete')}
      </Dropdown.Item>
    ),
    onMoveUp && (
      <Dropdown.Item key="move.up" onClick={onMoveUp}>
        {t('move.up')}
      </Dropdown.Item>
    ),
    onMoveDown && (
      <Dropdown.Item key="move.down" onClick={onMoveDown}>
        {t('move.down')}
      </Dropdown.Item>
    ),
    !adding && (
      <Dropdown.Item key="add.item" onClick={() => setAdding(TYPES.INPUT)}>
        {t('add.item')}
      </Dropdown.Item>
    ),
    canRevert && (
      <Dropdown.Item key="revert" onClick={() => onChange({ path, value: initialValue })}>
        {t('revert')}
      </Dropdown.Item>
    )
  ].filter(Boolean)

  return (
    <Card className={styles.objectEditor}>
      <Card.Header className={styles.header}>
        <Button variant="light" className={styles.info}>
          <i>folder_open</i>
        </Button>
        <div className={styles.label}>{label}</div>
        <DropdownButton
          disabled={options.length === 0}
          className={styles.dropdown}
          title=""
          variant="light"
        >
          {options}
        </DropdownButton>
      </Card.Header>
      <div className={styles.content}>
        {keys.map((id, index) => (
          <Resolver
            {...props}
            key={id}
            label={id}
            path={join(path, id)}
            value={_.get(value, id)}
            initialValue={_.get(initialValue, id)}
            onDelete={() => onChange({ path: join(path, id) })}
            onMoveUp={index > 0
              ? () => onChange({
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
              ? () => onChange({
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
              ref={(node) => node && setTimeout(() => node.focus())}
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
              {Object.values(TYPES).map((type) => (
                <option key={type} value={type}>
                  {t(type)}
                </option>
              ))}
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
                  onChange({ path: join(path, newKey), value: VALUES[adding] })
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
