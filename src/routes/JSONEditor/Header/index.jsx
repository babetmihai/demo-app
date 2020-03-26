import React, { Fragment } from 'react'
import {
  downloadJSON,
  uploadJSON
} from '../actions'
import { Button } from 'react-bootstrap'
import styles from './index.module.scss'

export default function Toolbar({ title, value }) {
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
