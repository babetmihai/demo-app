import React, { PureComponent } from 'react'
import * as d3 from 'd3'

import { setItem, getTarget } from '../actions'
import Label from './Label'
import styles from './index.module.scss'

export default class Item extends PureComponent {

  dr = 0
  dl = 0
  state = { dx: 0, dy: 0, dl: 0, dr: 0 }

  render() {
    const { item, itemHeight, itemWidth, pos } = this.props
    const { dx, dy, dl, dr, target } = this.state
    const isDragged = dx || dy || dr || dl
    const hasTarget = !!target
    const startOffset = Math.round((dx + dl) / itemWidth)
    const endOffset = Math.round((dx + dr) / itemWidth)

    const width = (item.end - item.start + 1) * itemWidth - dl + dr
    const height = itemHeight
    const left = (item.start - pos + 1) * itemWidth + dx + dl
    const top = item.row * itemHeight + dy
    const hasText = width > 75

    return (
      <div
        key={item.id}
        className={styles.item}
        style={{ height, width, left, top }}
      >
        <Label
          item={item}
          hasText={hasText}
          onDrag={this.handleDrag}
          onResizeStart={this.handleResizeStart}
          onResizeEnd={this.handleResizeEnd}
          hasTarget={hasTarget}
          isDragged={isDragged}
          startOffset={startOffset}
          endOffset={endOffset}
        />
      </div>
    )
  }

  handleDrag = (node) => {
    if (node) {
      const { dragContainer } = this.props
      d3.select(node)
        .call(d3.drag()
          .container(dragContainer)
          .on('drag', this.dragMove)
          .on('end', this.dragEnd)
        )
    }
  }

  dragMove = () => {
    const { item, itemWidth, itemHeight } = this.props
    const { dx, dy } = this.state
    const moveDx = dx + d3.event.dx
    const moveDy = dy + d3.event.dy
    const x = Math.round(moveDx / itemWidth)
    const y = Math.round(moveDy / itemHeight)

    this.setState({
      dx: moveDx,
      dy: moveDy,
      target: getTarget({
        id: item.id,
        start: item.start + x,
        end: item.end + x,
        row: Math.max(item.row + y, 0)
      })
    })
  }

  dragEnd = () => {
    const { item, itemWidth, itemHeight } = this.props
    const { target, dx, dy } = this.state
    const dragX = Math.round(dx / itemWidth)
    const dragY = Math.round(dy / itemHeight)
    if (!target) {
      setItem({
        ...item,
        start: item.start + dragX,
        end: item.end + dragX,
        row: Math.max(0, item.row + dragY)
      })
    }

    this.setState({
      target: undefined,
      dx: 0,
      dy: 0
    })
  }

  handleResizeStart = (node) => {
    if (node) {
      const { dragContainer } = this.props
      d3.select(node)
        .call(d3.drag()
          .container(dragContainer)
          .on('drag', this.resizeStartDrag)
          .on('end', this.resizeStartEnd)
        )
    }
  }

  resizeStartDrag = () => {
    const { item, itemWidth } = this.props
    const { dl } = this.state

    this.dl = this.dl + d3.event.dx
    const newStart = item.start + Math.round(this.dl / itemWidth)
    const target = getTarget({
      id: item.id,
      start: newStart,
      end: item.end,
      row: item.row
    })

    if (item.end - newStart < 15 && dl < this.dl) {
      this.endDl = this.dl
      this.setState({
        target
      })
    } else if (target) {
      this.startDl = this.dl
      this.setState({
        dl: (target.end - item.start + 1) * itemWidth,
        target
      })
    } else {
      this.setState({
        dl: (this.dl < this.startDl && this.dl > this.endDl) ? dl : this.dl,
        target
      })
    }
  }

  resizeStartEnd = () => {
    const { item, itemWidth } = this.props
    const { dl } = this.state
    setItem({
      ...item,
      start: item.start + Math.round(dl / itemWidth)
    })

    this.dl = 0
    this.setState({
      target: undefined,
      dl: 0
    })
  }

  handleResizeEnd = (node) => {
    if (node) {
      const { dragContainer } = this.props
      d3.select(node)
        .call(d3.drag()
          .container(dragContainer)
          .on('drag', this.resizeEndDrag)
          .on('end', this.resizeEndEnd)
        )
    }
  }

  resizeEndDrag = () => {
    const { item, itemWidth } = this.props
    const { dr } = this.state

    this.dr = this.dr + d3.event.dx
    const newEnd = item.end + Math.round(this.dr / itemWidth)
    const target = getTarget({
      id: item.id,
      start: item.start,
      end: newEnd,
      row: item.row
    })

    if (newEnd - item.start < 15 && dr > this.dr) {
      this.startDr = this.dr
      this.setState({
        target
      })
    } else if (target) {
      this.endDr = this.dr
      this.setState({
        dr: (target.start - item.end - 1) * itemWidth,
        target
      })
    } else {
      this.setState({
        dr: (this.dr < this.startDr && this.dr > this.endDr) ? dr : this.dr,
        target
      })
    }
  }

  resizeEndEnd = () => {
    const { item, itemWidth } = this.props
    const { dr } = this.state
    setItem({
      ...item,
      end: item.end + Math.round(dr / itemWidth)
    })
    this.dr = 0
    this.setState({
      target: undefined,
      dr: 0
    })
  }
}