import { encryptUrlParameter, decryptUrlParameter } from '../utils/urlParameterEncryption'

const FROM_PARAM = 'from'

export class NavigationService {
  /**
   * Build a forward link preserving the current page
   */
  appendFromParam(targetUrl: string, currentUrl?: string): string {
    if (!currentUrl) return targetUrl

    const cleaned = this.removeQueryParam(currentUrl, FROM_PARAM)
    const encrypted = encryptUrlParameter(cleaned)

    const separator = targetUrl.includes('?') ? '&' : '?'

    return `${targetUrl}${separator}${FROM_PARAM}=${encrypted}`
  }

  /**
   * Resolve a back link from the current request
   */
  getBackLink(currentUrl?: string, fallback = '/'): string {
    if (!currentUrl) return fallback

    const match = currentUrl.match(new RegExp(`[?&]${FROM_PARAM}=([^&]+)`))
    if (!match) return fallback

    const decrypted = decryptUrlParameter(match[1])

    return decrypted
  }

  /**
   * Remove a query parameter
   */
  private removeQueryParam(url: string, param: string): string {
    const [path, query] = url.split('?')

    if (!query) return url

    const filtered = query.split('&').filter(q => !q.startsWith(`${param}=`))

    return filtered.length ? `${path}?${filtered.join('&')}` : path
  }
}

export const navigationService = new NavigationService()
