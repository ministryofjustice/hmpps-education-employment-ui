/* eslint-disable @typescript-eslint/no-explicit-any */
import arrayToQueryString from './arrayToQueryString'

const mapToQueryString = (params: Record<string, any>): string =>
  Object.keys(params)
    .filter(key => params[key])
    .map(key => {
      if (Array.isArray(params[key])) return arrayToQueryString(params[key], key)
      return `${key}=${encodeURIComponent(params[key])}`
    })
    .join('&')

export default mapToQueryString
