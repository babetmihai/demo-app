import React, { PureComponent } from 'react'
import join from 'classnames'
import styles from './index.module.scss'

export default class Page extends PureComponent {

  render() {
    const {
      children,
      loading,
      className,
      ...props
    } = this.props

    if (loading) return (
      <div className={join(styles.page, styles.loading)}>
        <i>refresh</i>
      </div>
    )

    return (
      <div {...props} className={join(styles.page, className)}>
        {children}
      </div>
    )
  }
}
