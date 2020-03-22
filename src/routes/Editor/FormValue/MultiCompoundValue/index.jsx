import React, { PureComponent } from 'react'
import _ from 'lodash'

import { t } from 'core/intl'

import FormLabel from '../../FormLabel'
import FormLabelOption from '../../FormLabelOption'
import CompoundValue from '../CompoundValue'
import styles from './index.module.scss'
import { COMPOUND } from 'routes/Editor/constants'

class MultiCompundValue extends PureComponent {

  render() {
    const {
      name,
      dictionary,
      value,
      initialValue,
      error,
      loading,
      label,
      path,
      onChange,
      labelOptions
    } = this.props
    const valueList = _.castArray(value)
    const initialValueList = _.castArray(initialValue)

    if (valueList.length === 1) {
      return (
        <CompoundValue
          name={name}
          label={label}
          value={valueList[0]}
          initialValue={initialValueList[0]}
          error={error}
          loading={loading}
          dictionary={dictionary}
          onChange={onChange}
          path={path}
          labelOptions={{
            ...labelOptions,
            addValue: (
              <FormLabelOption
                key="addValue"
                label={t('add.list.item', { label }, 'Add { label }')}
                iconType="add_circle"
                onClick={this.handleAdd}
              />
            )
          }}
        />
      )
    }

    return (
      <div className={styles.multiCompoundValue}>
        <FormLabel
          label={label}
          type={COMPOUND}
          loading={loading === true}
          options={{
            ...labelOptions,
            createValue: (
              <FormLabelOption
                key="createValue"
                label={t('add.list.item', { label }, 'Add { label }')}
                iconType="add_circle"
                onClick={this.handleAdd}
              />
            )
          }}
        />
        <div className={styles.value}>
          {valueList.map((value, index) => (
            <CompoundValue
              key={index}
              name={name}
              label={`${t(label)} ${index + 1}`}
              value={valueList[index]}
              initialValue={initialValueList[index]}
              error={_.get(error, index)}
              loading={_.get(loading, index)}
              dictionary={dictionary}
              path={`${path}.${index}`}
              onChange={onChange}
              labelOptions={{
                ...labelOptions,
                removeValue: (
                  <FormLabelOption
                    id={index}
                    key="removeValue"
                    label={t('remove.list.item', { label: `${t(label)} ${index + 1}` }, 'Remove { label }')}
                    iconType="delete"
                    onClick={this.handleRemove}
                  />
                )
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  handleAdd = () => {
    const { name, value, path, onChange } = this.props
    const valueList = _.castArray(value)
    if (onChange) return onChange({
      name,
      value: [
        ...valueList,
        _.cloneDeep(valueList[valueList.length - 1])
      ],
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

export default MultiCompundValue