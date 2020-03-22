import React from 'react'
import _ from 'lodash'
import {
  addNode,
  refreshX,
  refreshY,
  refreshZ,
  refreshBase,
  clearCharts,
  clearSelection
} from '../actions'
import styles from './index.module.scss'

export default function Toolbar({ route, selected }) {
  const { x, y, z, base } = route
  return (
    <div className={styles.toolbar}>
      <button
        className="btn btn-light"
        onClick={addNode}
      >
        <i>add</i>
      </button>
      {x &&
        <button
          className="btn btn-light"
          onClick={refreshX}
        >
          <b>X</b>
        </button>
      }
      {y &&
        <button
          className="btn btn-light"
          onClick={refreshY}
        >
          <b>Y</b>
        </button>
      }
      {z &&
        <button
          className="btn btn-light"
          onClick={refreshZ}
        >
          <b>Z</b>
        </button>
      }
      {base &&
        <button
          className="btn btn-light"
          onClick={refreshBase}
        >
          <i>dashboard</i>
        </button>
      }
      <button
        className="btn btn-light"
        onClick={clearCharts}
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
