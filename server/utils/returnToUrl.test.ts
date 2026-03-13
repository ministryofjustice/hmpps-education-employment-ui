import { getReturnToUrl, removeQueryParam, appendFromParam } from './returnToUrl'
import { decryptUrlParameter, encryptUrlParameter } from './urlParameterEncryption'

jest.mock('./urlParameterEncryption')

const mockedDecrypt = decryptUrlParameter as jest.Mock
const mockEncrypt = encryptUrlParameter as jest.Mock

describe('getReturnToUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns defaultPath when requestUrl is undefined', () => {
    const result = getReturnToUrl(undefined, '/home')

    expect(result).toBe('/home')
  })

  it('returns defaultPath when no from parameter exists', () => {
    const result = getReturnToUrl('/jobs?page=2', '/home')

    expect(result).toBe('/home')
  })

  it('returns defaultPath when decryption fails', () => {
    mockedDecrypt.mockReturnValue(null)

    const result = getReturnToUrl('/jobs?from=encryptedValue', '/home')

    expect(mockedDecrypt).toHaveBeenCalledWith('encryptedValue')
    expect(result).toBe('/home')
  })

  it('returns decrypted URL when from parameter is valid', () => {
    mockedDecrypt.mockReturnValue('/jobs?page=2')

    const result = getReturnToUrl('/job/123?from=encryptedValue', '/home')

    expect(mockedDecrypt).toHaveBeenCalledWith('encryptedValue')
    expect(result).toBe('/jobs?page=2')
  })

  it('extracts from parameter when multiple query params exist', () => {
    mockedDecrypt.mockReturnValue('/dashboard')

    const result = getReturnToUrl('/job/123?foo=bar&from=encryptedValue&page=2')

    expect(result).toBe('/dashboard')
  })
})

describe('appendFromParam', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns targetUrl when currentUrl is undefined', () => {
    const result = appendFromParam('/target')

    expect(result).toBe('/target')
    expect(mockEncrypt).not.toHaveBeenCalled()
  })

  it('appends from parameter when targetUrl has no query string', () => {
    mockEncrypt.mockReturnValue('encryptedValue')

    const result = appendFromParam('/target', '/current')

    expect(mockEncrypt).toHaveBeenCalledWith('/current')
    expect(result).toBe('/target?from=encryptedValue')
  })

  it('appends using & when targetUrl already has query parameters', () => {
    mockEncrypt.mockReturnValue('encryptedValue')

    const result = appendFromParam('/target?page=1', '/current')

    expect(result).toBe('/target?page=1&from=encryptedValue')
  })

  it('removes existing from parameter from currentUrl before encrypting', () => {
    mockEncrypt.mockReturnValue('encryptedValue')

    appendFromParam('/target', '/current?from=old')

    expect(mockEncrypt).toHaveBeenCalledWith('/current')
  })

  it('handles multiple query params in currentUrl', () => {
    mockEncrypt.mockReturnValue('encryptedValue')

    const result = appendFromParam('/target', '/page?a=1&b=2')

    expect(mockEncrypt).toHaveBeenCalledWith('/page?a=1&b=2')
    expect(result).toBe('/target?from=encryptedValue')
  })
})

describe('removeQueryParam', () => {
  it('returns original url when no query string exists', () => {
    const result = removeQueryParam('/jobs', 'from')

    expect(result).toBe('/jobs')
  })

  it('removes the specified query parameter when it is the only one', () => {
    const result = removeQueryParam('/jobs?from=abc', 'from')

    expect(result).toBe('/jobs')
  })

  it('removes the specified parameter and keeps others', () => {
    const result = removeQueryParam('/jobs?page=1&from=abc', 'from')

    expect(result).toBe('/jobs?page=1')
  })

  it('removes the parameter when it appears first', () => {
    const result = removeQueryParam('/jobs?from=abc&page=2', 'from')

    expect(result).toBe('/jobs?page=2')
  })

  it('removes the parameter when it appears in the middle', () => {
    const result = removeQueryParam('/jobs?a=1&from=abc&b=2', 'from')

    expect(result).toBe('/jobs?a=1&b=2')
  })

  it('returns original url when parameter is not present', () => {
    const result = removeQueryParam('/jobs?page=1', 'from')

    expect(result).toBe('/jobs?page=1')
  })
})
