import React, { PureComponent, Fragment } from 'react'

import { t } from 'core/intl'

import IconButton from 'routes/Editor/IconButton'
import join from 'classnames'
import styles from './index.module.scss'

class TextInput extends PureComponent {

  state = {
    compare: false
  }

  render() {
    const { compare } = this.state
    const {
      value = {},
      icon,
      initialValue = {},
      error,
      loading,
      options,
      className,
      ...props
    } = this.props

    const {
      '$': inputValue = '',
      '@uomValue': uomValue = ''
    } = value
    const {
      '$': initialInputValue = '',
      '@uomValue': initialUomValue = ''
    } = initialValue
    const comparable = initialInputValue && (
      initialInputValue !== inputValue ||
      initialUomValue !== uomValue
    )

    const size = Math.max(15, inputValue.toString().length + 1)

    return (
      <Fragment>
        <div className={join('input-group', styles.textInput, className)}>
          <input
            {...props}
            size={size}
            required
            type="number"
            className={join(
              'form-control',
              error && 'is-invalid',
              styles.input
            )}
            value={inputValue}
            onChange={this.handleChange}
          />
          <select
            {...props}
            className={join(
              'form-control',
              error && 'is-invalid',
              styles.select
            )}
            value={uomValue}
            onChange={this.handleUomChange}
          >
            <option key="" value="">
              {}
            </option>
            {options.map((option) => (
              <option
                key={option}
                value={option}
              >
                {t(option)}
              </option>
            ))}
          </select>
          <div className="input-group-append">
            {comparable &&
              <IconButton
                type="compare_arrows"
                className={join('input-group-text', styles.inputButton)}
                onClick={this.handleCompare}
              />
            }
            {compare && comparable &&
              <div className={join('input-group-text', styles.initialValue)}>
                {`${initialInputValue} ${t(initialUomValue)}`}
              </div>
            }
            {icon}
            {loading &&
              <IconButton
                className={join('input-group-text', styles.inputButton)}
                animation="spin"
                type="refresh"
              />
            }
          </div>
        </div>
        {error &&
          <div className="invalid-feedback">
            {error}
          </div>
        }
      </Fragment>
    )
  }

  handleCompare = () => {
    this.setState(({ compare }) => ({
      compare: !compare
    }))
  }

  handleChange = (event) => {
    const inputValue = event.target.value
    const { onChange, value } = this.props

    if (onChange) return onChange({
      ...value,
      $: inputValue
    })
  }

  handleUomChange = (event) => {
    const uomValue = event.target.value
    const { onChange, value } = this.props

    if (onChange) return onChange({
      ...value,
      '@uomValue': uomValue
    })
  }
}

export default TextInput