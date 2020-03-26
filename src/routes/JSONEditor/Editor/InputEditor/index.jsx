import React, { PureComponent } from 'react'
import _ from 'lodash'
import { t } from 'core/intl'
import {
  Form,
  InputGroup,
  DropdownButton,
  Dropdown
} from 'react-bootstrap'
import styles from './index.module.scss'

export default class InputEditor extends PureComponent {

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
    const { label, initialValue, onDelete, onMoveUp, onMoveDown } = this.props
    const { value } = this.state
    const canRevert = (!_.isNil(initialValue) && initialValue !== value)
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
      canRevert && (
        <Dropdown.Item key="revert" onClick={this.handleRevert}>
          {t('revert')}
        </Dropdown.Item>
      )
    ].filter(Boolean)

    return (
      <InputGroup className={styles.inputEditor}>
        {label &&
          <InputGroup.Prepend>
            <InputGroup.Text>
              {label}
            </InputGroup.Text>
          </InputGroup.Prepend>
        }
        <Form.Control
          value={value}
          variant="secondary"
          onChange={this.handleChange}
        />
        <DropdownButton
          disabled={options.length === 0}
          className={styles.dropdown}
          as={InputGroup.Append}
          title=""
          variant="outline-info"
        >
          {options}
        </DropdownButton>
      </InputGroup>
    )
  }

  handleRevert = () => {
    const { onChange, initialValue, path } = this.props
    onChange({ path, value: initialValue })
  }

  handleChange = (event) => {
    const { path } = this.props
    const newValue = event.target.value
    this.editing = true
    this.setState({ value: newValue }, () => this.setValue({ value: newValue, path }))
  }

  setValue = _.debounce((...args) => {
    const { onChange } = this.props
    onChange(...args)
    this.editing = false
  }, 700, { trailing: true })
}
