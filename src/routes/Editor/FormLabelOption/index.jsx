import React, { PureComponent } from 'react'
import { ListGroup } from 'react-bootstrap'

import { t } from 'core/intl'

import styles from './index.module.scss'

export default class FormLabelOption extends PureComponent {

  render() {
    const { label, iconType, disabled } = this.props
    return (
      <ListGroup.Item
        disabled={disabled}
        className={styles.formLabelOption}
        onClick={this.handleClick}
      >
        {t(label)}
        <i className={styles.icon}>{iconType}</i>
      </ListGroup.Item>
    )
  }

  handleClick = () => {
    const { onClick, id, disabled } = this.props
    if (onClick && !disabled) onClick(id)
    document.body.click()
  }
}
