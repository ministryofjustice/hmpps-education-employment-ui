import type { NextFunction, Request, Response } from 'express'
import checkPrisonerProfileViewCriteria from './checkPrisonerProfileViewCriteria'
import type PrisonerSearchService from '../services/prisonSearchService'
import type PrisonerSearchByPrisonIdResponse from '../data/prisonerSearch/prisonerSearchByPrisonIdResponse'
import PrisonerProfileService from '../services/prisonerProfileService'
import GetProfileByIdResult from '../data/prisonerProfile/getProfileByIdResult'

describe('checkPrisonerInActiveCaseLoad middleware', () => {
  const renderMock = jest.fn()
  const statusMock = jest.fn().mockReturnValue({ render: renderMock })

  const makeReq = (id = 'A1234BC', module = 'wr') =>
    ({
      params: { id, module },
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

  const prisonerSearchService = {
    getPrisonerByCaseLoadIdAndOffenderId: jest.fn(),
  } as unknown as jest.Mocked<PrisonerSearchService>

  const prisonerProfileService = {
    getProfileById: jest.fn(),
  } as unknown as jest.Mocked<PrisonerProfileService>

  const middleware = checkPrisonerProfileViewCriteria(prisonerSearchService, prisonerProfileService)

  beforeEach(() => {
    jest.clearAllMocks()

    const profileByIdResult: GetProfileByIdResult = {
      bookingId: 0,
      createdBy: '',
      createdDateTime: '',
      modifiedBy: '',
      modifiedDateTime: '',
      offenderId: '',
      schemaVersion: '',
      profileData: {
        status: 'READY_TO_WORK',
      },
    }
    prisonerProfileService.getProfileById.mockResolvedValue(profileByIdResult)
  })

  it('calls next when prisoner is in active caseload (empty=false)', async () => {
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
        },
      ],
      empty: false,
    }
    prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerFound)

    const req = makeReq('A1234BC')
    const res = makeRes()
    const next: NextFunction = jest.fn()

    await middleware(req, res, next)

    expect(prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId).toHaveBeenCalledWith(
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
    const prisonerNotFound: PrisonerSearchByPrisonIdResponse = { content: [], empty: true }
    prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerNotFound)

    const req = makeReq('A1234BC')
    const res = makeRes()
    const next: NextFunction = jest.fn()

    await middleware(req, res, next)

    expect(statusMock).toHaveBeenCalledWith(404)
    expect(renderMock).toHaveBeenCalledWith('notFoundPage.njk', {
      continueUrl: '/wr/cohort-list?sort=releaseDate&order=ascending',
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('renders notFoundPage and does not call next when service throws', async () => {
    prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId.mockRejectedValue(new Error('boom'))

    const req = makeReq('A1234BC')
    const res = makeRes()
    const next: NextFunction = jest.fn()

    await middleware(req, res, next)

    expect(statusMock).toHaveBeenCalledWith(404)
    expect(renderMock).toHaveBeenCalledWith('notFoundPage.njk', {
      continueUrl: '/wr/cohort-list?sort=releaseDate&order=ascending',
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('does not render notFoundPage when prisoner is found', async () => {
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
        },
      ],
      empty: false,
    }
    prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerFound)

    const req = makeReq('A1234BC')
    const res = makeRes()
    const next: NextFunction = jest.fn()

    await middleware(req, res, next)

    expect(renderMock).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it('should render notFoundPage when releaseDate is missing', async () => {
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
          // releaseDate intentionally missing
        },
      ],
    }
    prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerFoundNoReleaseDate)

    const req = makeReq('A1234BC')
    const res = makeRes()
    const next: NextFunction = jest.fn()
    await middleware(req, res, next)

    expect(statusMock).toHaveBeenCalledWith(404)
    expect(renderMock).toHaveBeenCalledWith('notFoundPage.njk', {
      continueUrl: '/wr/cohort-list?sort=releaseDate&order=ascending',
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should render notFoundPage with correct continue url for mjma', async () => {
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
          // releaseDate intentionally missing
        },
      ],
    }
    prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerFoundNoReleaseDate)

    const req = makeReq('A1234BC', 'mjma')
    const res = makeRes()
    const next: NextFunction = jest.fn()
    await middleware(req, res, next)

    expect(statusMock).toHaveBeenCalledWith(404)
    expect(renderMock).toHaveBeenCalledWith('notFoundPage.njk', {
      continueUrl: '/mjma/prisoners?sort=releaseDate&order=ascending',
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should render notFoundPage with correct continue url for unrecognised module', async () => {
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
          // releaseDate intentionally missing
        },
      ],
    }
    prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerFoundNoReleaseDate)

    const req = makeReq('A1234BC', 'some-module-i-dont-know-about')
    const res = makeRes()
    const next: NextFunction = jest.fn()
    await middleware(req, res, next)

    expect(statusMock).toHaveBeenCalledWith(404)
    expect(renderMock).toHaveBeenCalledWith('notFoundPage.njk', {
      continueUrl: '/',
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should render notFoundPage for module mjma and prisoner status not allowed', async () => {
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
          releaseDate: '2028-08-13',
        },
      ],
    }
    prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerFoundNoReleaseDate)

    const profileByIdResult: GetProfileByIdResult = {
      bookingId: 0,
      createdBy: '',
      createdDateTime: '',
      modifiedBy: '',
      modifiedDateTime: '',
      offenderId: '',
      schemaVersion: '',
      profileData: {
        status: 'NO_RIGHT_TO_WORK',
      },
    }

    prisonerProfileService.getProfileById.mockResolvedValue(profileByIdResult)

    const req = makeReq('A1234BC', 'mjma')
    const res = makeRes()
    const next: NextFunction = jest.fn()
    await middleware(req, res, next)

    expect(statusMock).toHaveBeenCalledWith(404)
    expect(renderMock).toHaveBeenCalledWith('notFoundPage.njk', {
      continueUrl: '/mjma/prisoners?sort=releaseDate&order=ascending',
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should render notFoundPage for url containing mjma and prisoner status not allowed', async () => {
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
          releaseDate: '2028-08-13',
        },
      ],
    }
    prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId.mockResolvedValue(prisonerFoundNoReleaseDate)

    const profileByIdResult: GetProfileByIdResult = {
      bookingId: 0,
      createdBy: '',
      createdDateTime: '',
      modifiedBy: '',
      modifiedDateTime: '',
      offenderId: '',
      schemaVersion: '',
      profileData: {
        status: 'NO_RIGHT_TO_WORK',
      },
    }

    prisonerProfileService.getProfileById.mockResolvedValue(profileByIdResult)

    const req = makeReq('A1234BC')
    const res = makeRes({ locals: { originalUrl: '/mjma/prisoner/A1234BC/profile' } })
    const next: NextFunction = jest.fn()
    await middleware(req, res, next)

    expect(statusMock).toHaveBeenCalledWith(404)
    expect(renderMock).toHaveBeenCalledWith('notFoundPage.njk', {
      continueUrl: '/mjma/prisoners?sort=releaseDate&order=ascending',
    })
    expect(next).not.toHaveBeenCalled()
  })
})
