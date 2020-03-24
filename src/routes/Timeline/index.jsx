import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import _ from 'lodash'
import {
  selectItems,
  resetItems,
  getVisibleItems
} from './actions'

import Page from 'layout/Page'
import Header from './Header'
import Item from './Item'

import styles from './index.module.scss'

class Timeline extends PureComponent {
  contentNode
  state = {
    pos: 0,
    height: 0,
    width: 0,
    dx: 0,
    dy: 0,
    columnNo: 200,
    target: undefined,
    source: undefined,
    zoom: 1
  }

  initState = () => {
    const { width, height } = this.contentNode.getBoundingClientRect()
    this.setState({
      width, height
    })
  }

  componentDidMount() {
    const { items } = this.props
    if (_.isEmpty(items)) {
      resetItems()
    }
    window.addEventListener('resize', this.initState)
    window.addEventListener('orientationchange', this.initState)
    this.initState()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.initState)
    window.removeEventListener('orientationchange', this.initState)
  }

  render() {
    const { items } = this.props
    const { pos, width, columnNo, dx, dy, zoom } = this.state
    const columns = Math.round(columnNo / zoom)
    const visibleItems = getVisibleItems(
      items,
      pos - columns,
      pos + 2 * columns
    )
    const itemWidth = width / columns
    const itemHeight = 36

    return (
      <Page className={styles.timeline}>
        <Header
          zoom={zoom}
          setTimeline={this.handleTimeline}
        />
        <div className={styles.content} ref={this.handleDrag}>
          <div
            className={styles.rows}
            style={{
              marginLeft: dx,
              marginTop: dy
            }}
          >
            {this.contentNode && visibleItems.map((item) => (
              <Item
                key={item.id}
                pos={pos}
                item={item}
                itemHeight={itemHeight}
                itemWidth={itemWidth}
                dragContainer={this.contentNode}
              />
            ))}
          </div>
        </div>

      </Page>
    )
  }

  handleTimeline = (state) => {
    this.setState(state)
  }

  handleDrag = (node) => {
    this.contentNode = node
    if (this.contentNode) {
      d3.select(this.contentNode)
        .call(d3.drag()
          .on('drag', this.dragMove)
          .on('end', this.dragEnd)
        )
    }
  }

  dragMove = () => {
    const { dx, dy } = this.state
    this.setState({
      dx: dx + d3.event.dx,
      dy: dy + d3.event.dy
    })
  }

  dragEnd = () => {
    const { dx, pos, width, columnNo, zoom } = this.state
    const columns = Math.round(columnNo / zoom)
    const itemWidth = width / columns
    const dragX = Math.round(dx / itemWidth)
    this.setState({
      pos: pos - dragX,
      dx: 0
    })
  }
}

export default connect(() => ({
  items: selectItems()
}))(Timeline)