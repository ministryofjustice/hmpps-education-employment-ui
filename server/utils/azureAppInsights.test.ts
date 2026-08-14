import { DataTelemetry, EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts'
import { Request, Response } from 'express'
import * as appInsights from 'applicationinsights'
import { addUserDataToRequests, appInsightsMiddleware, operationNameProcessor, ContextObject } from './azureAppInsights'

jest.mock('applicationinsights', () => ({
  getCorrelationContext: jest.fn(),
  Contracts: {
    TelemetryTypeString: {
      Request: 'RequestData',
    },
  },
}))

const user = {
  activeCaseLoadId: 'MDI',
  username: 'test-user',
}

const createEnvelope = (
  properties: Record<string, string | boolean>,
  baseType = 'RequestData',
  name: string = undefined,
) =>
  ({
    tags: {} as Record<string, string>,
    data: {
      baseType,
      baseData: { properties, name },
    } as DataTelemetry,
  } as EnvelopeTelemetry)

const createContext = (username: string, activeCaseLoadId: string) =>
  ({
    'http.ServerRequest': {
      res: {
        locals: {
          user: {
            username,
            activeCaseLoadId,
          },
        },
      },
    },
  } as ContextObject)

const context = createContext(user.username, user.activeCaseLoadId)

describe('operationNameProcessor', () => {
  it('overrides operation name when customProperties is a plain object', () => {
    const envelope = createEnvelope({}, 'RequestData', 'original')

    operationNameProcessor(envelope, {
      correlationContext: { customProperties: { operationName: 'GET /new-route' } },
    } as ContextObject)

    expect(envelope.tags['ai.operation.name']).toBe('GET /new-route')
    expect(envelope.data.baseData.name).toBe('GET /new-route')
  })

  it('overrides operation name when customProperties is a Map', () => {
    const envelope = createEnvelope({}, 'RequestData', 'original')
    const map = new Map([['operationName', 'POST /map-route']])

    operationNameProcessor(envelope, {
      correlationContext: { customProperties: map },
    } as ContextObject)

    expect(envelope.tags['ai.operation.name']).toBe('POST /map-route')
    expect(envelope.data.baseData.name).toBe('POST /map-route')
  })

  it('does not override when operationName is absent', () => {
    const envelope = createEnvelope({}, 'RequestData', 'original')

    operationNameProcessor(envelope, {
      correlationContext: { customProperties: {} },
    } as ContextObject)

    expect(envelope.tags['ai.operation.name']).toBeUndefined()
    expect(envelope.data.baseData.name).toBe('original')
  })

  it('does not override when correlationContext is absent', () => {
    const envelope = createEnvelope({}, 'RequestData', 'original')

    operationNameProcessor(envelope, {} as ContextObject)

    expect(envelope.tags['ai.operation.name']).toBeUndefined()
  })

  it('returns true', () => {
    const envelope = createEnvelope({})
    expect(operationNameProcessor(envelope, {} as ContextObject)).toBe(true)
  })
})

describe('appInsightsMiddleware', () => {
  const mockGetCorrelationContext = appInsights.getCorrelationContext as jest.Mock

  const mockReq = (routePath?: string) =>
    ({
      method: 'GET',
      route: routePath ? { path: routePath } : undefined,
    } as unknown as Request)

  const mockRes = () => {
    const listeners: Record<string, (() => void)[]> = {}
    return {
      prependListener: (event: string, cb: () => void) => {
        listeners[event] = listeners[event] || []
        listeners[event].push(cb)
      },
      emit: (event: string) => listeners[event]?.forEach(cb => cb()),
    } as unknown as Response
  }

  it('sets operationName on correlationContext when route is present', () => {
    const setProperty = jest.fn()
    mockGetCorrelationContext.mockReturnValue({ customProperties: { setProperty } })

    const req = mockReq('/test-path')
    const res = mockRes()

    appInsightsMiddleware()(req, res, jest.fn())
    res.emit('finish')

    expect(setProperty).toHaveBeenCalledWith('operationName', 'GET /test-path')
  })

  it('does not set operationName when route is absent', () => {
    const setProperty = jest.fn()
    mockGetCorrelationContext.mockReturnValue({ customProperties: { setProperty } })

    const req = mockReq()
    const res = mockRes()

    appInsightsMiddleware()(req, res, jest.fn())
    res.emit('finish')

    expect(setProperty).not.toHaveBeenCalled()
  })

  it('does not throw when correlationContext is absent', () => {
    mockGetCorrelationContext.mockReturnValue(null)

    const req = mockReq('/test-path')
    const res = mockRes()

    expect(() => {
      appInsightsMiddleware()(req, res, jest.fn())
      res.emit('finish')
    }).not.toThrow()
  })
})

describe('azureAppinsights', () => {
  describe('addUserDataToRequests', () => {
    it('adds user data to properties when present', () => {
      const envelope = createEnvelope({ other: 'things' })

      addUserDataToRequests(envelope, context)

      expect(envelope.data.baseData.properties).toStrictEqual({
        ...user,
        other: 'things',
      })
    })

    it('handles absent user data', () => {
      const envelope = createEnvelope({ other: 'things' })

      addUserDataToRequests(envelope, createContext(undefined, user.activeCaseLoadId))

      expect(envelope.data.baseData.properties).toStrictEqual({ other: 'things' })
    })

    it('returns true when not RequestData type', () => {
      const envelope = createEnvelope({}, 'NOT_REQUEST_DATA')

      const response = addUserDataToRequests(envelope, context)

      expect(response).toStrictEqual(true)
    })

    it('handles when no properties have been set', () => {
      const envelope = createEnvelope(undefined)

      addUserDataToRequests(envelope, context)

      expect(envelope.data.baseData.properties).toStrictEqual(user)
    })

    it('handles missing user details', () => {
      const envelope = createEnvelope({ other: 'things' })

      addUserDataToRequests(envelope, {
        'http.ServerRequest': {},
      } as ContextObject)

      expect(envelope.data.baseData.properties).toEqual({
        other: 'things',
      })
    })
  })
})
