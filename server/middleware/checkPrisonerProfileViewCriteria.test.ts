import type { NextFunction, Request, Response } from 'express'
import checkPrisonerProfileViewCriteria from './checkPrisonerProfileViewCriteria'
import type PrisonerSearchService from '../services/prisonSearchService'
import type PrisonerSearchByPrisonIdResponse from '../data/prisonerSearch/prisonerSearchByPrisonIdResponse'

describe('checkPrisonerInActiveCaseLoad middleware', () => {
  const renderMock = jest.fn()
  const statusMock = jest.fn().mockReturnValue({ render: renderMock })

  const makeReq = (id = 'A1234BC') =>
    ({
      params: { id },
    } as unknown as Request)

  const makeRes = (overrides?: Partial<Response> & { locals?: Partial<Response['locals']> }) =>
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

  it('calls next when prisoner is in active caseload (empty=false)', async () => {
    const service = makeService()
    const prisonerFound: PrisonerSearchByPrisonIdResponse = {
      content: [
        {
          prisonerNumber: 'G3523GT',
          pncNumber: 'PNC123456',
          title: 'Mr',
          firstName: 'EILLIPS',
          lastName: 'XAVION',
          prisonId: 'MDI',
          releaseDate: '2028-08-13',
          confirmedReleaseDate: '2028-08-13',
        },
      ],
      empty: false,
    }
    service.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerFound)

    const middleware = checkPrisonerProfileViewCriteria(service)

    const req = makeReq('A1234BC')
    const res = makeRes()
    const next: NextFunction = jest.fn()

    await middleware(req, res, next)

    expect(service.getPrisonerByCaseLoadIdAndOffenderId).toHaveBeenCalledWith(
      res.locals.username,
      res.locals.userActiveCaseLoad.caseLoadId,
      'A1234BC',
    )

    expect(statusMock).not.toHaveBeenCalled()
    expect(renderMock).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith()
  })

  it('renders notFoundPage and does not call next when response is empty', async () => {
    const service = makeService()
    const prisonerNotFound: PrisonerSearchByPrisonIdResponse = { content: [], empty: true }
    service.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerNotFound)

    const middleware = checkPrisonerProfileViewCriteria(service)

    const req = makeReq('A1234BC')
    const res = makeRes()
    const next: NextFunction = jest.fn()

    await middleware(req, res, next)

    expect(statusMock).toHaveBeenCalledWith(404)
    expect(renderMock).toHaveBeenCalledWith('notFoundPage.njk')
    expect(next).not.toHaveBeenCalled()
  })

  it('renders notFoundPage and does not call next when service throws', async () => {
    const service = makeService()
    service.getPrisonerByCaseLoadIdAndOffenderId.mockRejectedValue(new Error('boom'))

    const middleware = checkPrisonerProfileViewCriteria(service)

    const req = makeReq('A1234BC')
    const res = makeRes()
    const next: NextFunction = jest.fn()

    await middleware(req, res, next)

    expect(statusMock).toHaveBeenCalledWith(404)
    expect(renderMock).toHaveBeenCalledWith('notFoundPage.njk')
    expect(next).not.toHaveBeenCalled()
  })

  it('does not render notFoundPage when prisoner is found', async () => {
    const service = makeService()
    const prisonerFound: PrisonerSearchByPrisonIdResponse = {
      content: [
        {
          prisonerNumber: 'G3523GT',
          pncNumber: 'PNC123456',
          title: 'Mr',
          firstName: 'EILLIPS',
          lastName: 'XAVION',
          prisonId: 'MDI',
          releaseDate: '2028-08-13',
          confirmedReleaseDate: '2028-08-13',
        },
      ],
      empty: false,
    }
    service.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerFound)

    const middleware = checkPrisonerProfileViewCriteria(service)

    const req = makeReq('A1234BC')
    const res = makeRes()
    const next: NextFunction = jest.fn()

    await middleware(req, res, next)

    expect(renderMock).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it('should render notFoundPage when releaseDate is missing', async () => {
    const service = makeService()
    const prisonerFoundNoReleaseDate: PrisonerSearchByPrisonIdResponse = {
      empty: false,
      content: [
        {
          prisonerNumber: 'G3523GT',
          pncNumber: 'PNC123456',
          title: 'Mr',
          firstName: 'EILLIPS',
          lastName: 'XAVION',
          prisonId: 'MDI',
          confirmedReleaseDate: '2028-08-13',
          // releaseDate intentionally missing
        },
      ],
    }
    service.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerFoundNoReleaseDate)

    const middleware = checkPrisonerProfileViewCriteria(service)

    const req = makeReq('A1234BC')
    const res = makeRes()
    const next: NextFunction = jest.fn()
    await middleware(req, res, next)

    expect(statusMock).toHaveBeenCalledWith(404)
    expect(renderMock).toHaveBeenCalledWith('notFoundPage.njk')
    expect(next).not.toHaveBeenCalled()
  })
})
