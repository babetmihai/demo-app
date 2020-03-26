import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { selectEditor, initEditor, setValue } from './actions'
import Page from 'layout/Page'
import Editor from './Editor'
import styles from './index.module.scss'
import Toolbar from './Toolbar'

class JSONEditor extends PureComponent {

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
        <Toolbar value={value} />
        <Editor
          onChange={setValue}
          label="editor"
          value={value}
          initialValue={initialValue}
        />
      </Page>
    )
  }
}

export default connect(selectEditor)(JSONEditor)
