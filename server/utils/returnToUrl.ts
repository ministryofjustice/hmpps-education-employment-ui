import { decryptUrlParameter, encryptUrlParameter } from './urlParameterEncryption'

const FROM_PARAM = 'from'

/**
 * Extracts and decrypts a return URL safely.
 */
export function getReturnToUrl(requestUrl?: string, defaultPath = '/'): string {
  if (!requestUrl) return defaultPath

  const match = requestUrl.match(new RegExp(`[?&]${FROM_PARAM}=([^&]+)`))
  if (!match) return defaultPath

  const encrypted = match[1]

  const decrypted = decryptUrlParameter(encrypted)
  if (!decrypted) return defaultPath

  return decrypted
}

/*
  remove any existing from parameter before appending a new one
 */
export function removeQueryParam(url: string, param: string): string {
  const [path, query] = url.split('?')

  if (!query) return url

  const filtered = query.split('&').filter(q => !q.startsWith(`${param}=`))

  return filtered.length ? `${path}?${filtered.join('&')}` : path
}

export function appendFromParam(targetUrl: string, currentUrl?: string): string {
  if (!currentUrl) return targetUrl

  const cleaned = removeQueryParam(currentUrl, FROM_PARAM)
  const encrypted = encryptUrlParameter(cleaned)

  const separator = targetUrl.includes('?') ? '&' : '?'

  return `${targetUrl}${separator}${FROM_PARAM}=${encrypted}`
}
