import React, { PureComponent } from 'react'
import _ from 'lodash'
import FormLabel from '../../FormLabel'
import InputValue from '../InputValue'
import styles from './index.module.scss'

class SingularValue extends PureComponent {

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
    return (
      <div className={styles.singularValue}>
        <FormLabel
          type={type}
          label={label}
          options={labelOptions}
          loading={loading}
        />
        <div className={styles.value}>
          <InputValue
            name={name}
            value={value}
            initialValue={initialValue}
            error={error}
            dictionary={dictionary}
            path={path}
            onChange={onChange}
          />
        </div>
      </div>
    )
  }
}

export default SingularValue