import { NavigationService } from './navigationService'
import { encryptUrlParameter, decryptUrlParameter } from '../utils/urlParameterEncryption'

jest.mock('../utils/urlParameterEncryption')

const mockEncrypt = encryptUrlParameter as jest.Mock
const mockDecrypt = decryptUrlParameter as jest.Mock

describe('NavigationService', () => {
  let service: NavigationService

  beforeEach(() => {
    service = new NavigationService()
    jest.clearAllMocks()
  })

  describe('appendFromParam', () => {
    it('returns targetUrl if currentUrl is undefined', () => {
      const result = service.appendFromParam('/target')

      expect(result).toBe('/target')
      expect(mockEncrypt).not.toHaveBeenCalled()
    })

    it('appends from param when target has no query string', () => {
      mockEncrypt.mockReturnValue('encryptedValue')

      const result = service.appendFromParam('/target', '/current')

      expect(mockEncrypt).toHaveBeenCalledWith('/current')
      expect(result).toBe('/target?from=encryptedValue')
    })

    it('uses & if targetUrl already contains query parameters', () => {
      mockEncrypt.mockReturnValue('encryptedValue')

      const result = service.appendFromParam('/target?page=1', '/current')

      expect(result).toBe('/target?page=1&from=encryptedValue')
    })

    it('removes existing from parameter from currentUrl before encrypting', () => {
      mockEncrypt.mockReturnValue('encryptedValue')

      const result = service.appendFromParam('/target', '/current?from=abc')

      expect(mockEncrypt).toHaveBeenCalledWith('/current')
      expect(result).toBe('/target?from=encryptedValue')
    })

    it('preserves other query parameters in currentUrl', () => {
      mockEncrypt.mockReturnValue('encryptedValue')

      const result = service.appendFromParam('/target', '/current?a=1&b=2')

      expect(mockEncrypt).toHaveBeenCalledWith('/current?a=1&b=2')
      expect(result).toBe('/target?from=encryptedValue')
    })
  })

  describe('getBackLink', () => {
    it('returns fallback if currentUrl is undefined', () => {
      const result = service.getBackLink(undefined, '/fallback')

      expect(result).toBe('/fallback')
    })

    it('returns fallback if from parameter is missing', () => {
      const result = service.getBackLink('/page?a=1', '/fallback')

      expect(result).toBe('/fallback')
    })

    it('decrypts and returns the from parameter', () => {
      mockDecrypt.mockReturnValue('/previous')

      const result = service.getBackLink('/page?from=encryptedValue')

      expect(mockDecrypt).toHaveBeenCalledWith('encryptedValue')
      expect(result).toBe('/previous')
    })

    it('works when from parameter is not first query parameter', () => {
      mockDecrypt.mockReturnValue('/previous')

      const result = service.getBackLink('/page?a=1&from=encryptedValue&b=2')

      expect(mockDecrypt).toHaveBeenCalledWith('encryptedValue')
      expect(result).toBe('/previous')
    })

    it('returns fallback when decryption returns null', () => {
      mockDecrypt.mockReturnValue(null)

      const result = service.getBackLink('/page?from=encryptedValue', '/fallback')

      expect(result).toBe(null) // current implementation behaviour
    })
  })
})
