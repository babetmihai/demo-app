import Promise from 'bluebird'
import { value, dictionary } from './defaults'

let fieldReject = {}
export const cancelChangeService = ({ path }) => {
  for (const lastPath in fieldReject) {
    if (
      path === lastPath ||
      lastPath.includes(path) ||
      path.includes(lastPath)
    ) {
      const error = new Error()
      error.canceled = true
      fieldReject[lastPath](error)
      delete fieldReject[lastPath]
    }
  }
}

export const cancelAllChangeService = () => {
  for (const lastPath in fieldReject) {
    const error = new Error()
    error.canceled = true
    fieldReject[lastPath](error)
    delete fieldReject[lastPath]
  }
}

let submitReject
export const cancelSubmitService = () => {
  if (submitReject) {
    const error = new Error()
    error.canceled = true
    submitReject(error)
    submitReject = undefined
  }
}

let revertReject
export const cancelRevertService = () => {
  if (revertReject) {
    const error = new Error()
    error.canceled = true
    revertReject(error)
    revertReject = undefined
  }
}

export const changeService = ({ path } = {}) => new Promise((resolve, reject) => {
  fieldReject[path] = reject
  return Promise.delay(500)
    .then(resolve)
    .catch(reject)
    .finally(() => {
      if (fieldReject[path] === reject) delete fieldReject[path]
    })
})

export const submitService = () => new Promise((resolve, reject) => {
  submitReject = reject
  return Promise.delay(1000)
    .then(resolve)
    .catch(reject)
    .finally(() => {
      if (submitReject === reject) submitReject = undefined
    })
})

export const revertService = () => new Promise((resolve, reject) => {
  revertReject = reject
  return Promise.delay(500)
    .then(resolve)
    .catch(reject)
    .finally(() => {
      if (revertReject === reject) revertReject = undefined
    })
})

export const initService = () => {
  return Promise.delay(500)
    .then(() => ({
      value,
      dictionary
    }))
}

