import React, { PureComponent } from 'react'
import join from 'classnames'

import styles from './Label.module.scss'

export default class Label extends PureComponent {

  render() {
    const {
      item,
      hasTarget,
      isDragged,
      startOffset,
      endOffset,
      hasText
    } = this.props

    return (
      <div
        className={join(
          styles.label,
          isDragged && styles.dragged,
          isDragged && hasTarget && styles.nodrop
        )}
        style={{
          background: `#${(item.value).toString(16).substr(-6)}`,
          color: `#${(1 - item.value).toString(16).substr(-6)}`
        }}
      >
        <div className={join(styles.contents, !hasText && styles.hidden)}>
          <span>{item.start + startOffset}</span>
          <span>{item.end + endOffset}</span>
        </div>
        <div ref={this.handleLeftRef} className={styles.resize} />
        <div ref={this.handleDragRef} className={styles.drag} />
        <div ref={this.handleRightRef} className={styles.resize} />
      </div>
    )
  }

  handleDragRef = (node) => {
    const { onDrag } = this.props
    node && onDrag && onDrag(node)
  }

  handleLeftRef = (node) => {
    const { onResizeStart } = this.props
    node && onResizeStart && onResizeStart(node)
  }

  handleRightRef = (node) => {
    const { onResizeEnd } = this.props
    node && onResizeEnd && onResizeEnd(node)
  }
}