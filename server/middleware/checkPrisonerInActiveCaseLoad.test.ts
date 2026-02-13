import type { Request, Response } from 'express'
import checkPrisonerInActiveCaseLoad from './checkPrisonerInActiveCaseLoad'
import PrisonerSearchService from '../services/prisonSearchService'
import PrisonerSearchByPrisonIdResponse from '../data/prisonerSearch/prisonerSearchByPrisonIdResponse'

describe('checkPrisonerInActiveCaseLoad middleware', () => {
  const renderMock = jest.fn()
  const statusMock = jest.fn(() => ({ render: renderMock }))

  const makeReq = (id = 'A1234BC') =>
    ({
      params: { id },
    } as unknown as Request)

  const makeRes = (overrides?: Response) =>
    ({
      locals: {
        userActiveCaseLoad: { caseLoadId: 'MDI' },
        username: 'username',
        ...(overrides?.locals ?? {}),
      },
      status: statusMock,
      ...(overrides ?? {}),
    } as unknown as Response)

  const makeService = (): jest.Mocked<PrisonerSearchService> =>
    ({
      getPrisonerByCaseLoadIdAndOffenderId: jest.fn<
        Promise<PrisonerSearchByPrisonIdResponse>,
        [string, string, string]
      >(),
    } as unknown as jest.Mocked<PrisonerSearchService>)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets profileViewNotAllowed=false and calls next when prisoner is in active caseload (empty=false)', async () => {
    const service = makeService()
    const prisonerFound: PrisonerSearchByPrisonIdResponse = { content: [], empty: false }
    service.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerFound)

    const middleware = checkPrisonerInActiveCaseLoad(service)

    const req = makeReq('A1234BC')
    const res = makeRes()
    const next = jest.fn()

    await middleware(req, res, next)

    expect(service.getPrisonerByCaseLoadIdAndOffenderId).toHaveBeenCalledWith(
      res.locals.username,
      res.locals.userActiveCaseLoad.caseLoadId,
      'A1234BC',
    )

    expect(res.locals.profileViewNotAllowed).toBe(false)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  it('sets profileViewNotAllowed=true and calls next when response is empty', async () => {
    const service = makeService()
    const prisonerNotFound: PrisonerSearchByPrisonIdResponse = { content: [], empty: true }
    service.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerNotFound)

    const middleware = checkPrisonerInActiveCaseLoad(service)

    const req = makeReq('A1234BC')
    const res = makeRes()
    const next = jest.fn()

    await middleware(req, res, next)

    expect(res.locals.profileViewNotAllowed).toBe(true)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  it('sets profileViewNotAllowed=true and calls next when service throws', async () => {
    const service = makeService()
    service.getPrisonerByCaseLoadIdAndOffenderId.mockRejectedValue(new Error('boom'))

    const middleware = checkPrisonerInActiveCaseLoad(service)

    const req = makeReq('A1234BC')
    const res = makeRes()
    const next = jest.fn()

    await middleware(req, res, next)

    expect(res.locals.profileViewNotAllowed).toBe(true)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  it('initialises profileViewNotAllowed to false even if already set', async () => {
    const service = makeService()
    const prisonerFound: PrisonerSearchByPrisonIdResponse = { content: [], empty: false }
    service.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerFound)

    const middleware = checkPrisonerInActiveCaseLoad(service)

    const req = makeReq('A1234BC')
    const res = makeRes()
    res.locals.profileViewNotAllowed = true
    const next = jest.fn()

    await middleware(req, res, next)

    expect(res.locals.profileViewNotAllowed).toBe(false)
    expect(next).toHaveBeenCalled()
  })
})
