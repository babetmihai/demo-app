import React, { PureComponent, Fragment } from 'react'
import join from 'classnames'

import { t } from 'core/intl'

import IconButton from 'routes/Editor/IconButton'
import styles from './index.module.scss'

class SelectInput extends PureComponent {

  state = {
    compare: false
  }

  render() {
    const { compare } = this.state
    const {
      value = {},
      options,
      icon,
      initialValue = {},
      error,
      loading,
      className,
      ...props
    } = this.props

    const { '$': selectValue = '' } = value
    const { '$': initialSelectValue } = initialValue
    const comparable = initialSelectValue && initialSelectValue !== selectValue
    return (
      <Fragment>
        <div className={join('input-group', styles.selectInput, className)}>
          <select
            {...props}
            className={join(
              'form-control',
              error && 'is-invalid',
              styles.select
            )}
            value={selectValue}
            onChange={this.handleChange}
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
          <div className={join('input-group-append', styles.append)}>
            {comparable &&
              <IconButton
                type="compare_arrows"
                className={join('input-group-text', styles.inputButton)}
                onClick={this.handleCompare}
              />
            }
            {compare && comparable &&
              <div className={join('input-group-text', styles.initialValue)}>
                {t(initialSelectValue)}
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
    const selectValue = event.target.value
    const { onChange } = this.props
    if (onChange) return onChange({
      $: selectValue
    })
  }
}

export default SelectInput