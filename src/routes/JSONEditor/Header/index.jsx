import React, { Fragment } from 'react'
import {
  downloadJSON,
  uploadJSON,
  setSearch
} from '../actions'
import { t } from 'core/intl'
import { Button, Form } from 'react-bootstrap'
import styles from './index.module.scss'

export default function Header({ search, title, value }) {
  const [input, setInput] = React.useState(search)

  return (
    <Fragment>
      <div className={styles.header}>
        <Button
          htmlFor="json.upload"
          as="label"
          variant="light"
          className={styles.button}
        >
          <i>publish</i>
        </Button>
        <Button
          variant="light"
          className={styles.button}
          onClick={() => downloadJSON({ name: title, value })}
        >
          <i>get_app</i>
        </Button>
        <div className={styles.right}>
          <Form.Control
            value={input}
            placeholder={t('search.for.label')}
            className={styles.filter}
            onChange={(event) => {
              const newSearch = event.target.value
              setInput(newSearch)
              setSearch(newSearch)
            }}
          />
        </div>
      </div>
      <input
        id="json.upload"
        className={styles.uploadInput}
        type="file"
        onChange={(event) => {
          const [file] = event.target.files
          uploadJSON({ file })
        }}
      />
    </Fragment>

  )
}
