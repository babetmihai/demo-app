import store from 'store/actions'
import _ from 'lodash'
import shortid from 'shortid'
import { rng } from 'core/d3'

export const selectHierarchies = () => store.get('hierarchies', {})

export const addNode = () => {
  store.update('hierarchies', (hierarchies = {}) => {
    const { selected = {}, data = {} } = hierarchies
    switch (true) {
      case (_.isEmpty(data)): {
        const parentId = shortid.generate()
        const parentValue = rng(100, 1)
        const id = shortid.generate()
        const value = rng(100, 1)
        return {
          ...hierarchies,
          data: {
            [parentId]: { id: parentId, value: parentValue },
            [id]: { id, value, parentId }
          }
        }
      }
      case (!Object.values(selected).some(Boolean)): {
        const parentId = _.sample(Object.keys(data))
        const id = shortid.generate()
        const value = rng(100, 1)
        return {
          ...hierarchies,
          data: {
            ...data,
            [id]: { id, value, parentId }
          }
        }
      }
      default: {
        return {
          ...hierarchies,
          data: {
            ...data,
            ...Object.keys(selected)
              .filter((id) => selected[id])
              .reduce((acc, parentId) => {
                const id = shortid.generate()
                const value = rng(100, 1)
                acc[id] = { id, parentId, value }
                return acc
              }, {})
          }
        }
      }
    }
  })
}

export const refreshValue = () => {
  store.update('hierarchies.data', (data = {}) => Object.values(data)
    .reduce((acc, item) => {
      acc[item.id] = {
        ...item,
        value: rng(100, 1)
      }
      return acc
    }, {}))
}

export const clearHierarchy = () => store.delete('hierarchies')
export const clearSelection = (selected) => {
  const { data } = selectHierarchies()
  const selectedChildren = Object.values(data)
    .filter(({ parentId }) => selected[parentId])
    .reduce((acc, node) => {
      acc[node.id] = true
      return acc
    }, {})
  if (!_.isEmpty(selectedChildren)) clearSelection(selectedChildren)
  Object.keys(selected).forEach((id) => {
    store.delete(`hierarchies.data.${id}`)
  })
  store.delete('hierarchies.selected')

}

export const initHierarchy = () => {
  if (_.isEmpty(selectHierarchies())) {
    _.range(10).forEach(() => addNode())
  }
}

export const selectNode = (id) => {
  const { selected = {} } = selectHierarchies()
  if (selected[id]) {
    store.delete('hierarchies.selected')
  } else {
    store.set('hierarchies.selected', { [id]: true })
  }
}