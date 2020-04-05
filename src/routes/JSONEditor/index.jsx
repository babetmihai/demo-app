import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { selectEditor, initEditor, setValue, filterValue } from './actions'
import Page from 'layout/Page'
import Header from './Header'
import Editor from './Editor'
import { t } from 'core/intl'
import styles from './index.module.scss'

class JSONEditor extends PureComponent {

  componentDidMount() {
    const { value } = this.props
    if (!value) initEditor()
  }

  render() {
    const { value, initialValue, search = '', title } = this.props
    const editorTitle = title || `${t('editor')}.json`

    return (
      <Page
        loading={!value}
        className={styles.jsonEditor}
      >
        <Header
          value={value}
          search={search}
          title={editorTitle}
        />
        <div className={styles.content}>
          <Editor
            onChange={setValue}
            label={editorTitle}
            value={filterValue({ search, value })}
            initialValue={initialValue}
          />
        </div>
      </Page>
    )
  }
}

export default connect(selectEditor)(JSONEditor)
