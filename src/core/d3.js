import * as d3 from 'd3'

export const extent = (list = []) => {
  const [min = 0, max = 100] = d3.extent(list)
  return {
    min,
    max
  }
}

const absCeil = (number) => Math.sign(number) * Math.ceil(Math.abs(number))
const absFloor = (number) => Math.sign(number) * Math.floor(Math.abs(number))
export const roundExtent = ({ min = 0, max = 100 } = {}, base = 0) => {
  const baseMin = Math.min(base, min)
  const baseMax = Math.max(base, max)

  if (Math.sign(baseMin) === Math.sign(baseMax)) {
    return {
      min: absFloor(baseMin / 100) * 100,
      max: absCeil(baseMax / 100) * 100
    }
  } else {
    return {
      min: absCeil(baseMin / 100) * 100,
      max: absCeil(baseMax / 100) * 100
    }
  }
}

export const rng = (max, min = 1) => (min + Math.floor(Math.random() * (max - min)))