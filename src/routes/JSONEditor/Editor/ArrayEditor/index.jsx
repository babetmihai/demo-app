import React from 'react'
import _ from 'lodash'
import { t } from 'core/intl'
import { join, TYPES, VALUES } from '../../actions'
import {
  Form,
  Card,
  InputGroup,
  DropdownButton,
  Dropdown,
  Button,
  OverlayTrigger,
  Popover
} from 'react-bootstrap'
import Resolver from '../../Editor'
import styles from './index.module.scss'

export default function ArrayEditor({
  label,
  path,
  value,
  onDelete,
  onChange,
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
    !adding && (
      <Dropdown.Item key="add.value" onClick={() => setAdding(TYPES.INPUT)}>
        {t('add.value')}
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
        <OverlayTrigger
          rootClose
          placement="auto"
          trigger="click"
          overlay={(
            <Popover className={styles.options}>
              <Popover.Title>
                {t('array')}
              </Popover.Title>
              <Popover.Content>
                {t('array.description')}
              </Popover.Content>
            </Popover>
          )}
        >
          <Button
            tabIndex={-1}
            variant="light"
            className={styles.info}
          >
            <i>filter_none</i>
          </Button>
        </OverlayTrigger>
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
            label={index}
            initialValue={_.get(initialValue, index)}
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

