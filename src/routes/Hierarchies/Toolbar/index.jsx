import React from 'react'
import _ from 'lodash'
import {
  addNode,
  refreshValue,
  clearHierarchy,
  clearSelection
} from '../actions'

import styles from './index.module.scss'

export default function Toolbar({ route, selected }) {
  const { value } = route || {}
  return (
    <div className={styles.toolbar}>
      <button
        className="btn btn-light"
        onClick={addNode}
      >
        <i>add</i>
      </button>
      {value &&
        <button
          className="btn btn-light"
          onClick={refreshValue}
        >
          <i>cached</i>
        </button>
      }
      <button
        className="btn btn-light"
        onClick={clearHierarchy}
      >
        <i>cancel_presentation</i>
      </button>
      {!_.isEmpty(selected) &&
        <button
          className="btn btn-light"
          onClick={() => clearSelection(selected)}
        >
          <i>delete_outline</i>
        </button>
      }

    </div>
  )
}
