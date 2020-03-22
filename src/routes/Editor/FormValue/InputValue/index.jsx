import React, { PureComponent } from 'react'
import throttle from 'lodash/throttle'
import get from 'lodash/get'
import TextInput from './TextInput'
import MeasurementInput from './MeasurementInput'
import LanguageInput from './LanguageInput'
import SelectInput from './SelectInput'
import styles from './index.module.scss'

const TEXT = 'TEXT'
const NUMBER = 'NUMBER'
const SELECT = 'SELECT'
const DATE = 'DATE'
const MEASUREMENT = 'MEASUREMENT'
const MULTILANGUAGE = 'MULTILANGUAGE'

class InputValue extends PureComponent {

  state = {
    value: this.props.value
  }

  componentDidUpdate(lastProps) {
    const { value } = this.props
    if (value !== lastProps.value) {
      this.setState(() => ({ value }))
    }
  }

  render() {
    const { value } = this.state
    const {
      icon,
      name,
      dictionary,
      initialValue,
      error
    } = this.props
    const { type, options } = get(dictionary, name, {})
    switch (true) {
      case (type === MULTILANGUAGE): return (
        <LanguageInput
          className={styles.inputValue}
          value={value}
          initialValue={initialValue}
          error={error}
          icon={icon}
          onChange={this.handleChange}
        />
      )
      case (type === MEASUREMENT): return (
        <MeasurementInput
          className={styles.inputValue}
          value={value}
          initialValue={initialValue}
          options={options}
          error={error}
          icon={icon}
          onChange={this.handleChange}
        />
      )
      case (type === TEXT): return (
        <TextInput
          className={styles.inputValue}
          value={value}
          initialValue={initialValue}
          error={error}
          icon={icon}
          onChange={this.handleChange}
        />
      )
      case (type === NUMBER): return (
        <TextInput
          className={styles.inputValue}
          inputType="number"
          value={value}
          initialValue={initialValue}
          error={error}
          icon={icon}
          onChange={this.handleChange}
        />
      )
      case (type === SELECT): return (
        <SelectInput
          className={styles.inputValue}
          value={value}
          initialValue={initialValue}
          error={error}
          options={options}
          icon={icon}
          onChange={this.handleChange}
        />
      )
      case (type === DATE): return (
        <TextInput
          className={styles.inputValue}
          inputType="date"
          value={value}
          initialValue={initialValue}
          error={error}
          icon={icon}
          onChange={this.handleChange}
        />
      )
      default: return null
    }
  }

  handleChange = (value) => {
    this.setState(() => ({ value }), () => {
      this.throttledChange(value)
    })
  }

  throttledChange = throttle((value) => {
    const { name, onChange, path } = this.props
    if (onChange) return onChange({ name, value, path })
  }, 500, { trailing: true, leading: true })
}

export default InputValue