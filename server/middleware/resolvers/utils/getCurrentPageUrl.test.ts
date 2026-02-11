import { Request, Response } from 'express'
import getCurrentPathMiddleware from './getCurrentPageUrl'

describe('getCurrentPageUrl', () => {
  const mockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
    originalUrl: '/some/path?from=abc',
    ...overrides,
  })

  const mockResponse = (): Partial<Response> => ({
    locals: {},
  })

  it('sets res.locals.currentPath from req.originalUrl', () => {
    const req = mockRequest()
    const res = mockResponse()
    const next = jest.fn()

    getCurrentPathMiddleware(req as Request, res as Response, next)

    expect(res.locals?.currentPath).toBe('/some/path')
  })

  it('extracts the from query parameter when present', () => {
    const req = mockRequest({
      originalUrl: '/some/path?from=encodedValue123',
    })
    const res = mockResponse()
    const next = jest.fn()

    getCurrentPathMiddleware(req as Request, res as Response, next)

    expect(res.locals?.backLink).toBe('encodedValue123')
  })

  it('calls next()', () => {
    const req = mockRequest()
    const res = mockResponse()
    const next = jest.fn()

    getCurrentPathMiddleware(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledTimes(1)
  })

  it('URL-decodes the from query parameter', () => {
    const req = mockRequest({
      originalUrl: '/some/path?from=U2FsdGVkX1%2Babc%3D',
    })
    const res = mockResponse()
    const next = jest.fn()

    getCurrentPathMiddleware(req as Request, res as Response, next)

    expect(res.locals?.backLink).toBe('U2FsdGVkX1+abc=')
  })

  it('sets from to undefined when the query parameter is missing', () => {
    const req = mockRequest({
      originalUrl: '/some/path?foo=bar',
    })
    const res = mockResponse()
    const next = jest.fn()

    getCurrentPathMiddleware(req as Request, res as Response, next)

    expect(res.locals?.from).toBeUndefined()
  })

  it('sets from to undefined when there is no query string', () => {
    const req = mockRequest({
      originalUrl: '/some/path',
    })
    const res = mockResponse()
    const next = jest.fn()

    getCurrentPathMiddleware(req as Request, res as Response, next)

    expect(res.locals?.from).toBeUndefined()
  })

  it('sets from to undefined when there is no query string', () => {
    const req = mockRequest({
      originalUrl: '/some/path',
    })
    const res = mockResponse()
    const next = jest.fn()

    getCurrentPathMiddleware(req as Request, res as Response, next)

    expect(res.locals?.from).toBeUndefined()
  })
})
