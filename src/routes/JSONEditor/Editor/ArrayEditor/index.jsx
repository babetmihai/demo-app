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
import Resolver from '../../Editor'
import styles from './index.module.scss'

export default function ArrayEditor({
  label,
  path,
  value,
  onDelete,
  onChange,
  onMoveUp,
  onMoveDown,
  initialValue,
  ...props
}) {
  const [adding, setAdding] = React.useState()
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
    <Card className={styles.arrayEditor}>
      <Card.Header className={styles.header}>
        <Button variant="light" className={styles.info}>
          <i>format_list_bulleted</i>
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
        {value.map((item, index) => (
          <Resolver
            {...props}
            key={index}
            path={join(path, index)}
            value={item}
            initialValue={_.get(initialValue, index)}
            onMoveUp={index > 0
              ? () => onChange({ path, value: swap(value, index, index - 1) })
              : undefined
            }
            onMoveDown={(index < value.length - 1)
              ? () => onChange({ path, value: swap(value, index, index + 1) })
              : undefined
            }
            onChange={onChange}
            onDelete={() => onChange({ path, value: value.filter((i) => i !== item) })}
          />
        ))}
        {adding &&
          <InputGroup className={styles.newKey}>
            <Form.Control
              as="select"
              ref={(node) => node && setTimeout(() => node.focus())}
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
                onClick={() => setAdding(undefined)}
              >
                <i>cancel</i>
              </Button>
              <Button
                onClick={() => {
                  onChange({ path, value: [...value, VALUES[adding]] })
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

