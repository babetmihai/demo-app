import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { selectEditor, initEditor, setValue } from './actions'
import Page from 'layout/Page'
import JSONEditor from './JSONEditor'
import styles from './index.module.scss'

class FormComponent extends PureComponent {

  componentDidMount() {
    const { value } = this.props
    if (!value) initEditor()
  }

  render() {
    const { value, initialValue } = this.props
    return (
      <Page
        loading={!value}
        className={styles.editor}
      >
        <JSONEditor
          onChange={setValue}
          label="editor"
          value={value}
          initialValue={initialValue}
        />
      </Page>
    )
  }
}

export default connect(selectEditor)(FormComponent)
