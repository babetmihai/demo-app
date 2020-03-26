import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { selectEditor, initEditor, setValue } from './actions'
import Page from 'layout/Page'
import Header from './Header'
import Editor from './Editor'
import styles from './index.module.scss'

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
        className={styles.jsonEditor}
      >
        <Header value={value} />
        <div className={styles.content}>
          <Editor
            onChange={setValue}
            label="editor"
            value={value}
            initialValue={initialValue}
          />
        </div>

      </Page>
    )
  }
}

export default connect(selectEditor)(JSONEditor)
