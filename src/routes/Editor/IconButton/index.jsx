import React, { PureComponent } from 'react'
import { Button } from 'react-bootstrap'
import join from 'classnames'
import styles from './index.module.scss'

class IconButton extends PureComponent {

  render() {
    const { type, className, spin, ...props } = this.props

    return (
      <Button
        {...props}
        variant="outline-dark"
        tabIndex={-1}
        onClick={this.handleClick}
        className={join(styles.iconButton, className)}
      >
        <i className={join(spin && 'spin')}>{type}</i>
      </Button>
    )
  }

  handleClick = (event) => {
    event.preventDefault()
    const { id, onClick } = this.props
    if (onClick) onClick(id)
  }
}

export default IconButton