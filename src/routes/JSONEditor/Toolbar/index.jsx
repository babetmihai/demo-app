import React from 'react'
import _ from 'lodash'
import {
  downloadJSON,
  uploadJSON
} from '../actions'
import { Form, Button } from 'react-bootstrap'
import styles from './index.module.scss'

export default function Toolbar({ value }) {
  return (
    <div className={styles.toolbar}>
      <Form.File
        className="btn btn-light"

      >
        <Button>
          <i>publish</i>
        </Button>

        <Form.File.Input onChange={(event) => {
          const [file] = event.target.files
          uploadJSON({ file })
        }}
        />
      </Form.File>
      <Button
        variant="light"
        onClick={() => downloadJSON({ name: 'editor', value })}
      >
        <i>get_app</i>
      </Button>
    </div>
  )
}
