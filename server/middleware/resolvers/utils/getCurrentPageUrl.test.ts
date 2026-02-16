import getCurrentPathMiddleware, { getDefaultBackLink } from './getCurrentPageUrl'

jest.mock('../../../utils/index', () => ({
  encryptUrlParameter: jest.fn(() => 'encrypted-default'),
}))

const mockRequest = (overrides = {}) =>
  ({
    originalUrl: '/test',
    query: {},
    params: {},
    ...overrides,
  } as any)

const mockResponse = () =>
  ({
    locals: {},
  } as any)

const mockNext = jest.fn()

describe('getDefaultBackLink', () => {
  it('returns application mode path when id, jobId and mode exist', () => {
    const req = {
      params: { id: 'A123', jobId: '99', mode: 'edit' },
    } as any

    expect(getDefaultBackLink(req)).toBe('/mjma/A123/job/99/application/edit')
  })

  it('returns profile overview when only id exists', () => {
    const req = {
      params: { id: 'A123' },
    } as any

    expect(getDefaultBackLink(req)).toBe('/mjma/profile/A123/view/overview')
  })

  it('returns applications list when no id exists', () => {
    const req = { params: {} } as any

    expect(getDefaultBackLink(req)).toBe('/mjma/applications')
  })
})

describe('getCurrentPageUrl', () => {
  it('sets res.locals.currentPath to originalUrl', () => {
    const req = mockRequest({ originalUrl: '/abc?x=1' })
    const res = mockResponse()

    getCurrentPathMiddleware(req, res, mockNext)

    expect(res.locals.currentPath).toBe('/abc?x=1')
  })

  it('uses existing from query param', () => {
    const req = mockRequest({
      originalUrl: '/abc?from=existing',
    })
    const res = mockResponse()

    getCurrentPathMiddleware(req, res, mockNext)

    expect(req.query.from).toBe('existing')
  })

  it('uses encrypted default when from is not present', () => {
    const req = mockRequest({
      originalUrl: '/abc',
      params: { id: 'A123' },
    })
    const res = mockResponse()

    getCurrentPathMiddleware(req, res, mockNext)

    expect(req.query.from).toBe('encrypted-default')
  })

  it('preserves other query params and does not break', () => {
    const req = mockRequest({
      originalUrl: '/abc?sort=name&order=asc',
      params: { id: 'A123' },
    })
    const res = mockResponse()

    getCurrentPathMiddleware(req, res, mockNext)

    expect(req.query.from).toBe('encrypted-default')
  })

  it('handles undefined originalUrl', () => {
    const req = mockRequest({ originalUrl: undefined })
    const res = mockResponse()

    getCurrentPathMiddleware(req, res, mockNext)

    expect(res.locals.currentPath).toBe('')
  })

  it('calls next()', () => {
    const req = mockRequest()
    const res = mockResponse()
    const next = jest.fn()

    getCurrentPathMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
