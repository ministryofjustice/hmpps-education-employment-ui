/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import getCurrentPathMiddleware, { getDefaultBackLink } from './getCurrentPageUrl'
import JourneyTypeValue from '../../../enums/journeyTypeValue'

jest.mock('../../../utils/index', () => ({
  encryptUrlParameter: jest.fn(() => 'encrypted-default'),
}))

const mockRequest = (overrides = {}) =>
  ({
    originalUrl: '/test',
    query: {},
    params: {},
    ...overrides,
  } as unknown as Request)

const mockResponse = () =>
  ({
    locals: {},
  } as unknown as Response)

const mockNext: NextFunction = jest.fn()

describe('getDefaultBackLink', () => {
  const mockRequest = (params: Record<string, string> = {}): Request =>
    ({
      params,
    } as unknown as Request)

  it('returns JOB_DETAILS url', () => {
    const req = mockRequest({
      id: 'G6115VJ',
      jobId: '123',
    })

    const result = getDefaultBackLink(req, JourneyTypeValue.JOB_DETAILS)

    expect(result).toBe('/mjma/G6115VJ/job/123/details')
  })

  it('returns MATCHED_JOBS url', () => {
    const req = mockRequest({
      id: 'G6115VJ',
    })

    const result = getDefaultBackLink(req, JourneyTypeValue.MATCHED_JOBS)

    expect(result).toBe('/mjma/profile/G6115VJ/view/overview')
  })

  it('returns MANAGED_APPLICATIONS url', () => {
    const req = mockRequest({
      id: 'G6115VJ',
      jobId: '123',
      mode: 'edit',
    })

    const result = getDefaultBackLink(req, JourneyTypeValue.MANAGED_APPLICATIONS)

    expect(result).toBe('/mjma/G6115VJ/job/123/application/edit')
  })

  it('returns default when urlFrom is undefined', () => {
    const req = mockRequest()

    const result = getDefaultBackLink(req)

    expect(result).toBe('/mjma/prisoners?sort=releaseDate&order=ascending')
  })
})

describe('getCurrentPageUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets res.locals.currentPath to originalUrl', () => {
    const req = mockRequest({ originalUrl: '/abc?x=1' })
    const res = mockResponse()

    getCurrentPathMiddleware(null)(req, res, mockNext)

    expect(res.locals.currentPath).toBe('/abc?x=1')
    expect(mockNext).toHaveBeenCalled()
  })

  it('uses existing from query param if present', () => {
    const req = mockRequest({
      originalUrl: '/abc?from=existing',
    })
    const res = mockResponse()

    getCurrentPathMiddleware(JourneyTypeValue.JOB_DETAILS)(req, res, mockNext)

    expect(req.query.from).toBe('existing')
  })

  it('uses encrypted default when from is not present', () => {
    const req = mockRequest({
      originalUrl: '/abc',
      params: { id: 'A123' },
    })
    const res = mockResponse()

    getCurrentPathMiddleware()(req, res, mockNext)

    expect(req.query.from).toBeTruthy()
  })

  it('handles undefined originalUrl safely', () => {
    const req = mockRequest({ originalUrl: undefined })
    const res = mockResponse()

    getCurrentPathMiddleware()(req, res, mockNext)

    expect(res.locals.currentPath).toBe('')
    expect(mockNext).toHaveBeenCalled()
  })

  it('preserves other query params and does not break', () => {
    const req = mockRequest({
      originalUrl: '/abc?sort=name&order=asc',
      params: { id: 'A123' },
    })
    const res = mockResponse()

    getCurrentPathMiddleware(JourneyTypeValue.JOB_DETAILS)(req, res, mockNext)

    expect(req.query.from).toBeDefined()
    expect(req.query.from).not.toBe('')
    expect(typeof req.query.from).toBe('string')
  })

  it('handles undefined originalUrl', () => {
    const req = mockRequest({ originalUrl: undefined })
    const res = mockResponse()

    getCurrentPathMiddleware(JourneyTypeValue.JOB_DETAILS)(req, res, mockNext)

    expect(res.locals.currentPath).toBe('')
  })

  it('calls next()', () => {
    const req = mockRequest()
    const res = mockResponse()
    const next = jest.fn()

    getCurrentPathMiddleware(JourneyTypeValue.JOB_DETAILS)(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
