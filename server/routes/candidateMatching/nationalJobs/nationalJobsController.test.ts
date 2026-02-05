/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './nationalJobsController'
import validateFormSchema from '../../../utils/validateFormSchema'
import { getSessionData, setSessionData } from '../../../utils/session'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('NationalJobsController', () => {
  const { res, req, next } = expressMocks()

  res.locals.user = {}
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } }

  req.context.nationalJobsResults = {
    content: [
      {
        id: '019ba359-004f-7ff4-b94e-e9fdfddfa958',
        jobTitle: 'Handyman',
        employerName: 'Bus Enterprises Ltd.',
        sector: 'CLEANING_AND_MAINTENANCE',
        postcode: null,
        closingDate: '2026-05-01',
        hasExpressedInterest: false,
        createdAt: '2026-01-09T15:21:18.283239Z',
        distance: null,
        isNational: true,
        numberOfVacancies: 1,
      },
      {
        id: '0195615f-c694-7110-b62e-d07ece9f2bec',
        jobTitle: 'Handyman',
        employerName: 'Bus Enterprises Ltd.',
        sector: 'CLEANING_AND_MAINTENANCE',
        postcode: null,
        closingDate: '2026-05-01',
        hasExpressedInterest: false,
        createdAt: '2025-03-04T13:37:03.624438Z',
        distance: null,
        isNational: true,
        numberOfVacancies: 1,
      },
      {
        id: '019a92c8-c8f0-777d-a98c-0361db8def61',
        jobTitle: 'National Ranger',
        employerName: 'The Range',
        sector: 'OUTDOOR',
        postcode: null,
        closingDate: '2026-11-15',
        hasExpressedInterest: false,
        createdAt: '2025-11-17T17:07:03.601537Z',
        distance: null,
        isNational: true,
        numberOfVacancies: 1,
      },
      {
        id: '019ac5ed-9135-7bb3-a81d-f3f61ee04777',
        jobTitle: 'Administrative Assistant',
        employerName: 'Formula 1',
        sector: 'CLEANING_AND_MAINTENANCE',
        postcode: null,
        closingDate: null,
        hasExpressedInterest: false,
        createdAt: '2025-11-27T15:27:52.718949Z',
        distance: null,
        isNational: true,
        numberOfVacancies: 1,
      },
      {
        id: '019c0f07-3918-7ffc-b0be-113c37ad4182',
        jobTitle: 'Administrative Assistant',
        employerName: 'Formula 1',
        sector: 'CLEANING_AND_MAINTENANCE',
        postcode: null,
        closingDate: null,
        hasExpressedInterest: false,
        createdAt: '2026-01-30T13:10:57.605571Z',
        distance: null,
        isNational: true,
        numberOfVacancies: 1,
      },
      {
        id: '019a7de1-5c4f-7009-abee-9e69e836c165',
        jobTitle: 'Assistant manager',
        employerName: 'ASDA',
        sector: 'CLEANING_AND_MAINTENANCE',
        postcode: null,
        closingDate: null,
        hasExpressedInterest: false,
        createdAt: '2025-11-13T15:41:52.987975Z',
        distance: null,
        isNational: true,
        numberOfVacancies: 3,
      },
      {
        id: '019b93c4-ab41-733e-b96f-185e151f8002',
        jobTitle: 'Assistant manager - duplicated',
        employerName: 'ASDA',
        sector: 'CLEANING_AND_MAINTENANCE',
        postcode: null,
        closingDate: null,
        hasExpressedInterest: false,
        createdAt: '2026-01-06T14:44:59.028916Z',
        distance: null,
        isNational: true,
        numberOfVacancies: 3,
      },
      {
        id: '019bb1e5-aa31-7bb9-ae77-848687387d0b',
        jobTitle: 'Assistant manager',
        employerName: 'ASDA',
        sector: 'CLEANING_AND_MAINTENANCE',
        postcode: null,
        closingDate: null,
        hasExpressedInterest: false,
        createdAt: '2026-01-12T11:09:37.255217Z',
        distance: null,
        isNational: true,
        numberOfVacancies: 3,
      },
      {
        id: '019a7361-f4cc-7889-86a9-d0a99528eb25',
        jobTitle: 'Office manager',
        employerName: 'A Football manager 2',
        sector: 'CLEANING_AND_MAINTENANCE',
        postcode: null,
        closingDate: null,
        hasExpressedInterest: false,
        createdAt: '2025-11-11T14:46:31.167801Z',
        distance: null,
        isNational: true,
        numberOfVacancies: 5,
      },
      {
        id: '019bb7c2-ffac-7dd2-9484-b1dd023521a9',
        jobTitle: 'Testing f or Audit',
        employerName: 'Debenhams',
        sector: 'OUTDOOR',
        postcode: null,
        closingDate: null,
        hasExpressedInterest: false,
        createdAt: '2026-01-13T14:29:28.726480Z',
        distance: null,
        isNational: true,
        numberOfVacancies: 2,
      },
      {
        id: '01937370-2f15-7554-a8db-36d3bbca85cd',
        jobTitle: 'Caretaker',
        employerName: 'Aldi',
        sector: 'OUTDOOR',
        postcode: null,
        closingDate: null,
        hasExpressedInterest: false,
        createdAt: '2024-11-28T15:42:35.601058Z',
        distance: null,
        isNational: true,
        numberOfVacancies: 2,
      },
      {
        id: '019bb791-1905-7bbe-8d21-3a80145bedc6',
        jobTitle: '2 Test',
        employerName: 'Debenhams',
        sector: 'OUTDOOR',
        postcode: null,
        closingDate: null,
        hasExpressedInterest: false,
        createdAt: '2026-01-13T13:34:58.419053Z',
        distance: null,
        isNational: true,
        numberOfVacancies: 3,
      },
      {
        id: '019a92c6-c093-777d-a98b-fe180de17801',
        jobTitle: 'National Ranger rolling',
        employerName: 'The Range',
        sector: 'OUTDOOR',
        postcode: null,
        closingDate: null,
        hasExpressedInterest: false,
        createdAt: '2025-11-17T17:04:50.498542Z',
        distance: null,
        isNational: true,
        numberOfVacancies: 1,
      },
    ],
    page: {
      size: 20,
      number: 0,
      totalElements: 13,
      totalPages: 1,
    },
  }

  req.context.nationalEmployersList = {
    content: [
      {
        id: '019585ec-6b7f-7995-b8fb-f584d205b490',
        name: 'A Football manager 2',
        description: 'A Football manager 2 duplicate',
        sector: 'ARTS_ENTERTAINMENT',
        status: 'SILVER',
        createdAt: '2025-03-11T15:56:58.647749Z',
      },
      {
        id: '0191795b-a1ed-733f-bcf4-9e1799b327e2',
        name: 'Aldi',
        description:
          'Note - Employer Description must be 1000 characters or lessEmployer Description must be 1000 characters or lessEmployer Description must be 1000 characters or lessEmployer Description must be 1000 characters or lessEmployer Description must be 1000 characters or lessEmployer Description must be 1000 characters or lessEmployer Description must be 1000 characters or lessEmployer Description must be 1000 characters or lessEmployer Description must be 1000 characters or lessEmployer Description must be 1000 characters or lessEmployer Description must be 1000 characters or lessEmployer Description must be 1000 characters or lessEmployer Description must be 1000 characters or lessEmployer Description must be 1000 characters or lessEmployer Description must be 1000 characters or less..',
        sector: 'RETAIL',
        status: 'KEY_PARTNER',
        createdAt: '2024-08-22T10:12:14.404525Z',
      },
      {
        id: '0191795b-5f14-733f-bcf4-724402ccb766',
        name: 'ASDA',
        description: 'Some text',
        sector: 'RETAIL',
        status: 'GOLD',
        createdAt: '2024-08-22T10:11:57.544837Z',
      },
      {
        id: '0192bd6f-5446-7cc7-a13e-8c369dbe12a6',
        name: 'ASDA- DUPLICATE',
        description: 'Some text',
        sector: 'RETAIL',
        status: 'KEY_PARTNER',
        createdAt: '2024-10-24T07:30:43.193953Z',
      },
      {
        id: '019b21ce-24d7-7992-bf1b-9df789eccc6c',
        name: 'Auditing test',
        description: 'New employer',
        sector: 'MANUFACTURING',
        status: 'GOLD',
        createdAt: '2025-12-15T11:38:37.468434Z',
      },
      {
        id: '0191795b-d354-733f-bcf4-b8c98a9a72c2',
        name: 'Boots',
        description: 'Description for Boots',
        sector: 'MANUFACTURING',
        status: 'GOLD',
        createdAt: '2024-08-22T10:12:27.065222Z',
      },
      {
        id: '019474c1-cec6-7ee1-9c51-0b93b60fe519',
        name: 'Bus Enterprises Ltd.',
        description: 'Buses',
        sector: 'EDUCATION',
        status: 'GOLD',
        createdAt: '2025-01-17T14:54:08.123347Z',
      },
      {
        id: '01945ff0-c07e-744f-af04-420232000548',
        name: 'Camell Laird',
        description: 'testing',
        sector: 'CONSTRUCTION',
        status: 'KEY_PARTNER',
        createdAt: '2025-01-13T13:53:21.633654Z',
      },
      {
        id: '0191795b-fe8e-733f-bcf4-d5d70a691aba',
        name: 'Debenhams',
        description: 'Description for Debenhams',
        sector: 'MINING',
        status: 'GOLD',
        createdAt: '2024-08-22T10:12:38.110487Z',
      },
      {
        id: '01931f18-1721-755f-bfce-17af2eca775b',
        name: 'Formula 1',
        description: 'Sports and entertainment',
        sector: 'OTHER',
        status: 'GOLD',
        createdAt: '2024-11-12T06:38:13.826412Z',
      },
      {
        id: '0191795d-3478-733f-bcf5-8ab79cc09bbc',
        name: 'Home Bargains',
        description: 'Description for Home Bargains',
        sector: 'PROPERTY',
        status: 'KEY_PARTNER',
        createdAt: '2024-08-22T10:13:57.467553Z',
      },
      {
        id: '0191795c-0c5b-733f-bcf4-dfe30b0f7a2d',
        name: 'House of Fraser',
        description: 'Description for House of Fraser',
        sector: 'ARTS_ENTERTAINMENT',
        status: 'SILVER',
        createdAt: '2024-08-22T10:12:41.656729Z',
      },
      {
        id: '0191795b-7cd7-733f-bcf4-824b515e5bd4',
        name: "Sainsbury's",
        description: "Description for Sainsbury's",
        sector: 'ENERGY',
        status: 'KEY_PARTNER',
        createdAt: '2024-08-22T10:12:04.918838Z',
      },
      {
        id: '0191795c-766d-733f-bcf5-1f7fb54ab1f0',
        name: 'The Range',
        description: 'Description for The Range',
        sector: 'TECHNOLOGY',
        status: 'GOLD',
        createdAt: '2024-08-22T10:13:08.807798Z',
      },
    ],
    page: {
      size: 9999,
      number: 0,
      totalElements: 14,
      totalPages: 1,
    },
  }

  req.params.sort = 'releaseDate'
  req.params.order = 'descending'
  req.params.id = 'mock_id'
  const { sort, order, id } = req.params

  req.query = { sort, order }
  req.get = jest.fn()

  const mockNationalJobsResults = req.context.nationalJobsResults
  const mockNationalEmployersList = req.context.nationalEmployersList

  const mockPaginationService: any = {
    paginationData: {},
    getPaginationNew: jest.fn(() => paginationData),
  }

  const paginationData = {}

  const controller = new Controller(mockPaginationService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      await controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - records found - call renders with the correct data', async () => {
      await controller.get(req, res, next)
      next.mockReset()

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/nationalJobs/index', {
        backLocation: '/mjma/profile/mock_id/view/overview',
        profile: undefined,
        prisoner: undefined,
        notFoundMsg: undefined,
        order: 'descending',
        paginationData: {},
        filtered: true,
        id: 'mock_id',
        nationalJobsResults: mockNationalJobsResults,
        nationalEmployersList: mockNationalEmployersList,
        employerFilter: '',
        sort: 'releaseDate',
        jobSectorFilter: [],
        typeOfWorkOptions: [],
        typeOfWorkOtherOptions: [
          'OUTDOOR',
          'CLEANING_AND_MAINTENANCE',
          'CONSTRUCTION',
          'DRIVING',
          'BEAUTY',
          'HOSPITALITY',
          'TECHNICAL',
          'MANUFACTURING',
          'OFFICE',
          'RETAIL',
          'SPORTS',
          'WAREHOUSING',
          'EDUCATION_TRAINING',
          'WASTE_MANAGEMENT',
          'OTHER',
        ],
        userActiveCaseLoad: { activeCaseLoad: { caseLoadId: 'MDI', description: 'Moorland (HMP & YOI)' } },
      })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    const errors = { details: 'mock_error' }
    const validationMock = validateFormSchema as jest.Mock

    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      validationMock.mockReset()
      setSessionData(req, ['nationalJobs', 'data'], mockNationalJobsResults)
      mockPaginationService.getPaginationNew.mockReturnValue(paginationData)
    })

    it('Should create a new instance', () => {
      expect(controller).toBeDefined()
    })

    it('On error - Calls next with error', async () => {
      validationMock.mockImplementation(() => {
        throw new Error('mock_error')
      })

      controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })

    it('On validation error - Calls render with correct data', async () => {
      validationMock.mockImplementation(() => errors)

      controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/nationalJobs/index', {
        ...mockNationalJobsResults,
        nationalEmployersList: mockNationalEmployersList,
        errors,
        jobSectorFilter: [],
        jobSectorFilterOther: [],
        employerFilter: '',
      })
    })

    it('On successful POST - call renders with the correct data', async () => {
      req.body.jobSectorFilter = ['COOKING']
      req.body.employerFilter = '1000'

      controller.post(req, res, next)

      expect(getSessionData(req, ['nationalJobs', 'data'])).toBeTruthy()
      expect(res.redirect).toHaveBeenCalledWith(
        `/mjma/${id}/jobs/national-jobs?sort=releaseDate&order=descending&jobSectorFilter=COOKING&employerFilter=1000`,
      )
    })
  })
})
