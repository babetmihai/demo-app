import React, { PureComponent, Fragment } from 'react'
import join from 'classnames'

import { t } from 'core/intl'

import IconButton from 'routes/Editor/IconButton'
import styles from './index.module.scss'

const options = ['de', 'en', 'ro']
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
      className,
      ...props
    } = this.props

    const {
      '$': inputValue = '',
      '@lang': langValue = ''
    } = value
    const {
      '$': initialInputValue = '',
      '@lang': initialLangValue = ''
    } = initialValue
    const comparable = initialInputValue && (
      initialInputValue !== inputValue ||
      initialLangValue !== langValue
    )

    return (
      <Fragment>
        <div className={join('input-group', styles.languageInput, className)}>
          <textarea
            {...props}
            required
            className={join(
              'form-control',
              error && 'is-invalid',
              styles.textarea
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
            value={langValue}
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
                {`${initialInputValue} (${t(initialLangValue)})`}
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
    const langValue = event.target.value
    const { onChange, value } = this.props

    if (onChange) return onChange({
      ...value,
      '@lang': langValue
    })
  }
}

export default TextInput