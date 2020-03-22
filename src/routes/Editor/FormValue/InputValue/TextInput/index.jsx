import React, { PureComponent, Fragment } from 'react'
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
      inputType = 'text',
      initialValue = {},
      error,
      loading,
      className,
      ...props
    } = this.props

    const { '$': inputValue = '' } = value
    const { '$': initialInputValue } = initialValue
    const comparable = initialInputValue && initialInputValue !== inputValue
    const size = Math.max(20, inputValue.toString().length + 1)

    return (
      <Fragment>
        <div className={join('input-group', styles.textInput, className)}>
          <input
            {...props}
            size={size}
            required
            type={inputType}
            className={join(
              'form-control',
              error && 'is-invalid',
              styles.input
            )}
            value={inputValue}
            onChange={this.handleChange}
          />
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
              {initialInputValue}
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
    const { onChange } = this.props

    if (onChange) return onChange({
      $: inputValue
    })
  }
}

export default TextInput