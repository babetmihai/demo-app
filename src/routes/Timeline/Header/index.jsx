import React, { PureComponent as Component } from 'react'
import { resetItems, addItem, clearItems } from '../actions'
import { Button, Form } from 'react-bootstrap'
import styles from './index.module.scss'

export default class Header extends Component {

  render() {
    const { zoom } = this.props

    return (
      <div className={styles.header}>
        <Button
          variant="light"
          className={styles.button}
          onClick={addItem}
        >
          <i>add</i>
        </Button>
        <Button
          variant="light"
          className={styles.button}
          onClick={this.handleResetClick}
        >
          <i>refresh</i>
        </Button>
        <Button
          variant="light"
          onClick={clearItems}
        >
          <i>cancel_presentation</i>
        </Button>
        <Form.Control
          type="range"
          step={10}
          min={20}
          max={120}
          value={zoom * 100}
          onChange={this.handleSlider}
          className={styles.slider}
        />

      </div>
    )
  }

  handleSlider = (event) => {
    const { setTimeline } = this.props
    setTimeline({
      zoom: event.target.value / 100
    })
  }

  handleResetClick = () => {
    const { setTimeline } = this.props
    setTimeline({
      pos: 0,
      dy: 0
    })
    resetItems()
  }
}