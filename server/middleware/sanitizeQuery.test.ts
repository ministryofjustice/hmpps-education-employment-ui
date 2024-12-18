/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import sanitizeQuery from './sanitizeQuery'

describe('sanitizeQuery Middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock<NextFunction>

  beforeEach(() => {
    req = { query: {} }
    res = {}
    next = jest.fn()
  })

  it('should sanitize non-whitelisted query parameters', () => {
    req.query = {
      unsafe: '<script>alert("xss")</script>',
      anotherUnsafe: '   value   ',
      from: 'trusted',
    }

    sanitizeQuery(req as Request, res as Response, next)

    expect(req.query).toEqual({
      unsafe: '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;',
      anotherUnsafe: 'value',
      from: 'trusted', // Whitelisted, remains unchanged
    })
    expect(next).toHaveBeenCalled()
  })

  it('should not modify whitelisted query parameters', () => {
    req.query = {
      from: '<script>trusted</script>',
    }

    sanitizeQuery(req as Request, res as Response, next)

    expect(req.query).toEqual({
      from: '<script>trusted</script>', // Whitelisted, remains unchanged
    })
    expect(next).toHaveBeenCalled()
  })

  it('should handle empty query parameters', () => {
    req.query = {}

    sanitizeQuery(req as Request, res as Response, next)

    expect(req.query).toEqual({})
    expect(next).toHaveBeenCalled()
  })

  it('should handle non-string query parameters without modification', () => {
    req.query = {
      number: 123,
      boolean: true,
    } as any

    sanitizeQuery(req as Request, res as Response, next)

    expect(req.query).toEqual({
      number: 123,
      boolean: true,
    })
    expect(next).toHaveBeenCalled()
  })
})
