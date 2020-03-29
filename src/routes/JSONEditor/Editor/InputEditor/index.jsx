import React, { PureComponent } from 'react'
import join from 'classnames'
import _ from 'lodash'
import { t } from 'core/intl'
import {
  InputGroup,
  DropdownButton,
  Dropdown
} from 'react-bootstrap'
import styles from './index.module.scss'

const getSizeClass = (value) => {
  switch (true) {
    case (value.length > 20): return styles.large
    case (value.length > 10): return styles.medium
    default: return styles.small
  }
}

export default class InputEditor extends PureComponent {

  state = { value: '', editing: false }

  componentDidMount() {
    const { value, onCount } = this.props
    this.setState({ value })
    onCount && onCount()
  }

  componentDidUpdate(lastProps) {
    const { value } = this.props
    const { editing } = this.state
    if (!editing && value !== lastProps.value) {
      this.setState({ value })
    }
  }

  render() {
    const { label, initialValue, onDelete, onDuplicate } = this.props
    const { value, editing } = this.state
    const canRevert = (!_.isNil(initialValue) && initialValue !== value)
    const options = [
      onDelete && (
        <Dropdown.Item key="delete" onClick={onDelete}>
          {t('delete')}
        </Dropdown.Item>
      ),
      canRevert && (
        <Dropdown.Item key="revert" onClick={this.handleRevert}>
          {t('revert')}
        </Dropdown.Item>
      ),
      onDuplicate && (
        <Dropdown.Item key="duplicate" onClick={onDuplicate}>
          {t('copy.item')}
        </Dropdown.Item>
      )
    ].filter(Boolean)

    return (
      <InputGroup className={styles.inputEditor}>
        <InputGroup.Prepend>
          <InputGroup.Text>
            {label}
          </InputGroup.Text>
        </InputGroup.Prepend>
        {editing
          ? (
            <input
              value={value}
              ref={(node) => node && setTimeout(() => node.focus())}
              variant="secondary"
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              className={join(
                'form-control',
                styles.input,
                getSizeClass(value)
              )}
            />
          ) : (
            <div
              tabIndex={0}
              onClick={this.handleFocus}
              onFocus={this.handleFocus}
              className={join(
                'form-control',
                styles.input,
                getSizeClass(value)
              )}
            >
              {value}
            </div>
          )
        }
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

  handleBlur = () => {
    this.setState({ editing: false })
  }

  handleFocus = () => {
    this.setState({ editing: true })
  }

  handleRevert = () => {
    const { onChange, initialValue, path } = this.props
    onChange({ path, value: initialValue })
  }

  handleChange = (event) => {
    const { path } = this.props
    const newValue = event.target.value
    this.setState({ value: newValue }, () => this.setValue({ value: newValue, path }))
  }

  setValue = _.debounce((...args) => {
    const { onChange } = this.props
    onChange(...args)
  }, 700, { trailing: true })
}
