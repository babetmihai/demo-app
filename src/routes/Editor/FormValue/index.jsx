import React, { PureComponent } from 'react'
import _ from 'lodash'
import FormLabelOption from '../FormLabelOption'
import MultiCompoundValue from './MultiCompoundValue'
import CompoundValue from './CompoundValue'
import MultiValue from './MultiValue'
import SingularValue from './SingularValue'
import { COMPOUND } from '../constants'
import { t } from 'core/intl'

export default class FormValue extends PureComponent {

  getLabelOptions() {
    const { path, dictionary, name, initialValue } = this.props
    const { type } = _.get(dictionary, name, {})

    return {
      removeValue: path && (
        <FormLabelOption
          key="removeValue"
          iconType="delete_forever"
          label={t('remove.field')}
          onClick={this.handleRemove}
        />
      ),
      revertValue: type && type !== COMPOUND && ! _.isEmpty(initialValue) && (
        <FormLabelOption
          key="revertValue"
          iconType="undo"
          label={t('revert.value')}
          onClick={this.handleRevert}
        />
      )
    }
  }

  handleRemove = () => {
    const { onChange, path, name } = this.props
    return onChange({ name, path })
  }

  handleRevert = () => {
    const { onChange, path, name, initialValue } = this.props
    return onChange({ name, path, value: initialValue })
  }

  render() {
    const {
      name,
      value,
      dictionary,
      onChange,
      path,
      error,
      loading,
      initialValue,
      label = name
    } = this.props
    const { type, multivalue } = _.get(dictionary, name, {})

    switch (true) {
      case (type === COMPOUND && multivalue): {
        return (
          <MultiCompoundValue
            name={name}
            error={error}
            loading={loading}
            value={value}
            initialValue={initialValue}
            dictionary={dictionary}
            label={label}
            labelOptions={this.getLabelOptions()}
            onChange={onChange}
            path={path}
          />
        )
      }
      case (!type || type === COMPOUND): {
        return (
          <CompoundValue
            name={name}
            error={error}
            loading={loading}
            value={value}
            initialValue={initialValue}
            dictionary={dictionary}
            label={label}
            labelOptions={this.getLabelOptions()}
            onChange={onChange}
            path={path}
          />
        )
      }
      case (!!multivalue): {
        return (
          <MultiValue
            name={name}
            error={error}
            loading={loading}
            value={value}
            initialValue={initialValue}
            dictionary={dictionary}
            label={label}
            labelOptions={this.getLabelOptions()}
            onChange={onChange}
            path={path}
          />
        )
      }
      default: {
        return (
          <SingularValue
            name={name}
            error={error}
            loading={loading}
            value={value}
            initialValue={initialValue}
            dictionary={dictionary}
            label={label}
            labelOptions={this.getLabelOptions()}
            onChange={onChange}
            path={path}
          />
        )
      }
    }
  }
}
