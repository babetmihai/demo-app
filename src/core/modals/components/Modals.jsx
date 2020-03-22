import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { selectModal, MODALS, hideModal } from 'core/modals'
import history from 'core/history'

class Modals extends PureComponent {
  componentDidMount() {
    this.unlisten = history.listen(() => {
      const { type } = this.props
      if (type) hideModal()
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const { type, ...props } = this.props
    if (!type) return null
    const Modal = MODALS[type]

    return (
      <Modal {...props} />
    )
  }
}

export default connect(selectModal)(Modals)