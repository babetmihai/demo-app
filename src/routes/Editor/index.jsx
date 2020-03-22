import React, { PureComponent } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import store from 'store/actions'
import { Button } from 'react-bootstrap'
import {
  formInit,
  formChange,
  formSubmit,
  formRevert,
  formDownload
} from './actions'
import FormValue from './FormValue'
import styles from './index.module.scss'
import Page from 'layout/Page'
import { t } from 'core/intl'

class FormComponent extends PureComponent {

  componentDidMount() {
    const { value } = this.props
    if (_.isEmpty(value)) formInit()
  }

  render() {
    const {
      value,
      initialValue,
      error,
      loading,
      dictionary
    } = this.props

    return (

      <Page
        loading={!value}
        className={styles.editor}
      >
        <div className={styles.header}>
          <Button
            variant="light"
            onClick={this.handleSubmit}
            type="submit"
          >
            <i>keyboard_return</i>
          </Button>
          <Button
            variant="light"
            onClick={this.handleRevert}
          >
            <i>undo</i>
          </Button>
          <Button
            variant="light"
            onClick={this.handleDownload}
          >
            <i>get_app</i>
          </Button>
        </div>
        <div className={styles.content}>
          <FormValue
            label={t('editor')}
            value={value}
            initialValue={initialValue}
            error={error}
            loading={loading}
            dictionary={dictionary}
            onChange={this.handleChange}
          />
        </div>
      </Page>
    )
  }

  handleChange = ({ name, value, path }) => {
    const { dictionary } = this.props
    return formChange({ name, value, path, dictionary })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { value, dictionary } = this.props
    return formSubmit({ value, dictionary })
  }

  handleRevert = (event) => {
    event.preventDefault()
    const { initialValue } = this.props
    return formRevert({ initialValue })
  }

  handleDownload = (event) => {
    event.preventDefault()
    const { value } = this.props
    return formDownload({
      value,
      name: t('editor')
    })
  }
}

export default connect(() => store.get('formData', {}))(FormComponent)
