import shortId from 'shortid'
import _ from 'lodash'
import store from 'store/actions'

export const selectItems = () => store.get('timeline.items', {})

export const addItem = () => {
  const lastRow = Math.max(...Object.values(selectItems()).map((item) => item.row), 0)
  const rn1 = Math.round(Math.random() * 250) + 5
  const rn2 = Math.round(Math.random() * 250) + 5
  const id = shortId.generate()
  const item = {
    id,
    start: Math.min(rn1, rn2),
    value: Math.random(),
    end: Math.max(
      rn1,
      rn2,
      Math.max(Math.abs(rn1 - rn2), 20) +
            Math.min(rn1, rn2)
    ) + 10,
    row: lastRow + 1
  }
  store.set(`timeline.items.${id}`, item)
}

export const resetItems = () => {
  const newItems = _.range(Math.round(Math.random() * 5) + 5)
    .map(() => {
      const rn1 = Math.round(Math.random() * 250) + 5
      const rn2 = Math.round(Math.random() * 250) + 5
      return {
        id: shortId.generate(),
        start: Math.min(rn1, rn2),
        value: Math.random(),
        end: Math.max(
          rn1,
          rn2,
          Math.max(Math.abs(rn1 - rn2), 20) +
            Math.min(rn1, rn2)
        ) + 10
      }
    })
    .reduce((acc, item, index) => {
      if (index === 0) return [{ ...item, row: 1 }]
      const previous = acc[index - 1]
      const row = previous.end < item.start
        ? previous.row
        : previous.row + 1
      return [...acc, { ...item, row }]
    }, [])
    .reduce((acc, item) => ({ ...acc, [item.id]: item }), {})

  store.set('timeline.items', newItems)
}

export const getTarget = (drag) => {
  return Object.values(selectItems()).find((item) => (
    (
      (drag.start <= item.end && drag.start >= item.start) ||
      (drag.end <= item.end && drag.end >= item.start) ||
      (drag.start <= item.start && drag.end >= item.end)
    ) &&
    drag.row === item.row &&
    drag.id !== item.id
  ))
}

export const clearItems = () => store.delete('timeline.items')

export const getVisibleItems = (items, min, max) => Object.values(items)
  .filter((item) => (item.end > min && item.start < max && item))

export const setItem = (item) => store.set(`timeline.items.${item.id}`, item)