import React, { PureComponent } from 'react'
import _ from 'lodash'

import SelectInput from '../InputValue/SelectInput'
import FormLabel from '../../FormLabel'
import FormLabelOption from '../../FormLabelOption'
import FormValue from '../../FormValue'
import styles from './index.module.scss'
import { COMPOUND } from 'routes/Editor/constants'
import { t } from 'core/intl'

class CompoundValue extends PureComponent {

  state = {
    adding: false
  }

  render() {
    const { adding } = this.state
    const {
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
    const valueKeys = Object.keys(value)
    const availableKeys = Object.keys(dictionary)
      .filter((key) => !valueKeys.includes(key))

    return (
      <div className={styles.compoundValue}>
        <FormLabel
          label={label}
          loading={loading === true}
          type={COMPOUND}
          options={{
            createValue: !adding && availableKeys.length > 0 && (
              <FormLabelOption
                key="createValue"
                label={t('add.new.field')}
                iconType="add"
                onClick={this.handleAdd}
              />
            ),
            ...labelOptions
          }}
        />
        <div className={styles.value}>
          {valueKeys
            .map((key) => (
              <FormValue
                key={key}
                name={key}
                value={_.get(value, key)}
                error={_.get(error, key)}
                loading={_.get(loading, key)}
                initialValue={_.get(initialValue, key)}
                dictionary={dictionary}
                path={path ? `${path}.${key}` : key}
                onChange={onChange}
              />
            ))}
          {adding &&
            <div className={styles.undefinedValue}>
              <FormLabel label="selectFieldType" />
              <SelectInput
                autoFocus
                options={availableKeys}
                onChange={this.handleUndefined}
                className={styles.select}
              />
            </div>
          }
        </div>
      </div>
    )
  }

  handleUndefined = (value) => {
    const { $: key } = value
    const { name, onChange, path } = this.props
    this.setState(() => ({ adding: false }))
    if (onChange && key) return onChange({
      name,
      path: path ? `${path}.${key}` : key,
      value: {}
    })
  }

  handleAdd = () => {
    this.setState(() => ({ adding: true }))
  }
}

export default CompoundValue