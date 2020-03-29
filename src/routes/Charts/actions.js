import store from 'store/actions'
import _ from 'lodash'
import shortid from 'shortid'
import { rng } from 'core/d3'

export const addNode = () => {
  const id = shortid.generate()
  store.set(`charts.data.${id}`, {
    id,
    x: rng(100, -100),
    y: rng(100, -100),
    z: rng(100, -100)
  })
}

export const refreshX = () => {
  store.update('charts.data', (data = {}) => Object.values(data)
    .reduce((acc, item) => {
      acc[item.id] = {
        ...item,
        x: rng(100, -100)
      }
      return acc
    }, {}))
}

export const refreshY = () => {
  store.update('charts.data', (data = {}) => Object.values(data)
    .reduce((acc, item) => {
      acc[item.id] = {
        ...item,
        y: rng(100, -100)
      }
      return acc
    }, {}))
}

export const refreshZ = () => {
  store.update('charts.data', (data = {}) => Object.values(data)
    .reduce((acc, item) => {
      acc[item.id] = {
        ...item,
        z: rng(100, -100)
      }
      return acc
    }, {}))
}

export const refreshBase = () => {
  store.set('charts.base', {
    x: rng(100, -100),
    y: rng(100, -100),
    z: rng(100, -100)
  })
}

export const selectCharts = () => store.get('charts', {})

export const initCharts = () => {
  if (_.isEmpty(selectCharts())) {
    _.range(10).forEach(() => addNode())
  }
}

export const clearCharts = () => store.delete('charts')

export const selectNode = (id) => {
  const { selected = {} } = selectCharts()
  if (selected[id]) {
    store.delete(`charts.selected.${id}`)
  } else {
    store.set(`charts.selected.${id}`, true)
  }
}

export const clearSelection = (selected) => {
  Object.keys(selected).forEach((id) => {
    store.delete(`charts.data.${id}`)
  })
  store.delete('charts.selected')
}