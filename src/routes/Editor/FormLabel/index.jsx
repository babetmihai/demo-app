import React, { PureComponent } from 'react'
import { t } from 'core/intl'
import { InputGroup } from 'react-bootstrap'
import IconButton from 'routes/Editor/IconButton'
import { OverlayTrigger, Popover, ListGroup } from 'react-bootstrap'
import styles from './index.module.scss'
import {
  COMPOUND,
  DATE,
  SELECT,
  MEASUREMENT,
  MULTILANGUAGE,
  TEXT,
  NUMBER
} from '../constants'

export default class FormLabel extends PureComponent {

  state = { loading: false }

  componentDidUpdate(lastProps) {
    const { loading } = this.props
    if (loading && !lastProps.loading) {
      this.timeout = setTimeout(this.showLoader, 250)
    }

    if (!loading && lastProps.loading) {
      clearTimeout(this.timeout)
      this.setState({ loading: false })
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  showLoader = () => {
    this.setState({ loading: true })
  }

  renderType() {
    const { type } = this.props
    switch (type) {
      case COMPOUND: return <i>folder</i>
      case DATE: return <i>today</i>
      case SELECT: return <i>list</i>
      case MEASUREMENT: return <i>speed</i>
      case MULTILANGUAGE: return <i>language</i>
      case TEXT: return <i>text_format</i>
      case NUMBER: return <i>keyboard</i>
      default: return <i>extension</i>
    }
  }

  render() {
    const { loading } = this.state
    const { label, options = {}, icons } = this.props
    const optionList = Object.values(options).filter(Boolean)

    return (
      <InputGroup className={styles.label}>
        <InputGroup.Prepend>
          <InputGroup.Text className={styles.typeText}>
            {this.renderType()}
          </InputGroup.Text>
          <InputGroup.Text id="basic-addon1">{t(label)}</InputGroup.Text>
        </InputGroup.Prepend>
        <InputGroup.Append>
          {icons}
          {loading
            ? <IconButton spin type="refresh" />
            : (optionList.length > 0 &&
              <OverlayTrigger
                rootClose
                placement="auto"
                trigger="click"
                overlay={(
                  <Popover className={styles.options}>
                    <ListGroup>
                      {optionList
                        .filter(Boolean)
                        .map((option) => option)
                      }
                    </ListGroup>
                  </Popover>
                )}
              >
                <IconButton type="arrow_drop_down" />
              </OverlayTrigger>
            )
          }
        </InputGroup.Append>
      </InputGroup>

    )
  }
}
