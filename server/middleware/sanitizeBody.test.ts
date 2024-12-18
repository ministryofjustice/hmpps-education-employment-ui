import { Request, Response, NextFunction } from 'express'
import sanitizeBody from './sanitizeBody'

describe('sanitizeBody Middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock<NextFunction>

  beforeEach(() => {
    req = { body: {} }
    res = {}
    next = jest.fn()
  })

  it('should sanitize non-whitelisted body fields', () => {
    req.body = {
      unsafe: '<script>alert("xss")</script>',
      anotherUnsafe: '   value   ',
      _csrf: 'safeToken',
    }

    sanitizeBody(req as Request, res as Response, next)

    expect(req.body).toEqual({
      unsafe: '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;',
      anotherUnsafe: 'value',
      _csrf: 'safeToken', // Whitelisted, remains unchanged
    })
    expect(next).toHaveBeenCalled()
  })

  it('should not modify whitelisted body fields', () => {
    req.body = {
      _csrf: '<script>safeToken</script>',
    }

    sanitizeBody(req as Request, res as Response, next)

    expect(req.body).toEqual({
      _csrf: '<script>safeToken</script>', // Whitelisted, remains unchanged
    })
    expect(next).toHaveBeenCalled()
  })

  it('should handle empty body', () => {
    req.body = {}

    sanitizeBody(req as Request, res as Response, next)

    expect(req.body).toEqual({})
    expect(next).toHaveBeenCalled()
  })

  it('should handle non-string body fields without modification', () => {
    req.body = {
      number: 123,
      boolean: true,
    }

    sanitizeBody(req as Request, res as Response, next)

    expect(req.body).toEqual({
      number: 123,
      boolean: true,
    })
    expect(next).toHaveBeenCalled()
  })
})
