import React from 'react'
import _ from 'lodash'

import ObjectEditor from './ObjectEditor'
import ArrayEditor from './ArrayEditor'
import InputEditor from './InputEditor'

export default function Editor(props) {
  const { value } = props
  switch (true) {
    case (_.isPlainObject(value)): return <ObjectEditor {...props} />
    case (_.isArray(value)): return <ArrayEditor {...props} />
    case (!_.isNil(value)): return <InputEditor {...props} />
    default: return null
  }
}
