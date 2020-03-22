import React, { PureComponent } from 'react'
import _ from 'lodash'
import IconButton from 'routes/Editor/IconButton'
import FormLabel from '../../FormLabel'
import InputValue from '../InputValue'
import styles from './index.module.scss'

class MultiValue extends PureComponent {

  render() {
    const {
      name,
      label,
      labelOptions,
      path,
      onChange,
      value,
      initialValue,
      error,
      loading,
      dictionary
    } = this.props
    const { type } = _.get(dictionary, name, {})
    const valueList = _.castArray(value)
    const initialValueList = _.castArray(initialValue)
    const isLoading = loading === true || !_.isEmpty(loading)
    const errorList = (_.isString(error) || !error)
      ? _.castArray(error)
      : error

    return (
      <div className={styles.multiValue}>
        <FormLabel
          label={label}
          options={labelOptions}
          loading={isLoading}
          type={type}
          icons={
            <IconButton
              type="add"
              onClick={this.handleAdd}
            />
          }
        />
        <div className={styles.value}>
          {valueList.map((_, index) => (
            <InputValue
              key={index}
              name={name}
              value={valueList[index]}
              initialValue={initialValueList[index]}
              error={errorList[index]}
              dictionary={dictionary}
              path={(valueList.length > 1
                ? `${path}.${index}`
                : path
              )}
              onChange={onChange}
              icon={valueList.length > 1 && (
                <IconButton
                  id={index}
                  type="remove"
                  onClick={this.handleRemove}
                />
              )}
            />
          ))}

        </div>
      </div>
    )
  }

  handleAdd = () => {
    const { name, value, path, onChange } = this.props
    if (onChange) return onChange({
      name,
      value: [..._.castArray(value), {}],
      path
    })
  }

  handleRemove = (removedIndex) => {
    const { name, value, path, onChange } = this.props
    const valueList = value.filter((_, index) => index !== removedIndex)
    if (onChange) return onChange({
      name,
      value: valueList.length > 1
        ? valueList
        : valueList[0],
      path
    })
  }
}

export default MultiValue