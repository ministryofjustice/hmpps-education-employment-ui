/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getPrisonerListMatchJobsResolver'
import getPrisonerAddressById from './utils/getPrisonerAddressById'

jest.mock('./utils/getPrisonerAddressById', () => ({
  ...jest.requireActual('./utils/getPrisonerAddressById'),
  __esModule: true,
  default: jest.fn(),
}))

describe('getPrisonerListMatchJobsResolver', () => {
  const { req, res, next } = expressMocks()

  const getPrisonerAddressByIdMock = getPrisonerAddressById as jest.Mock

  res.locals.user = { username: 'mock_username' }
  res.locals.userActiveCaseLoad = { activeCaseLoad: { caseLoadId: 'MDI' } }

  const mockData = {
    prisonerSearchResults: {
      content: [
        {
          prisonerNo: 'test_1',
          displayName: 'mock_displayName',
          releaseDate: 'mock_releaseDate',
          status: 'mock_status',
          workSummary: 'mock_workSummary',
          updatedOn: 'mock_updateOn',
        },
        {
          prisonerNo: 'test_2',
          displayName: 'mock_displayName',
          releaseDate: 'mock_releaseDate',
          status: 'mock_status',
          workSummary: 'mock_workSummary',
          updatedOn: 'mock_updateOn',
        },
      ],
    },
  }

  const serviceMock = {
    getPrisonersToMatchJobs: jest.fn(),
  }
  const serviceMock2 = {
    getPrisonerAddressById: jest.fn(),
  }
  const serviceMock3 = {
    getPrisonersByReleaseDate: jest.fn().mockReturnValue({ content: [] }),
  }

  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any, serviceMock2 as any, serviceMock3 as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getPrisonersToMatchJobs.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and call next', async () => {
    serviceMock.getPrisonersToMatchJobs.mockResolvedValue(mockData.prisonerSearchResults)
    getPrisonerAddressByIdMock.mockResolvedValue({ postcode: 'test_postcode' })

    await resolver(req, res, next)

    expect(req.context.prisonerListMatchedJobs).toEqual({
      content: [
        {
          prisonerNo: 'test_1',
          postcode: 'test_postcode',
          displayName: 'mock_displayName',
          releaseDate: 'mock_releaseDate',
          status: 'mock_status',
          workSummary: 'mock_workSummary',
          updatedOn: 'mock_updateOn',
        },
        {
          prisonerNo: 'test_2',
          postcode: 'test_postcode',
          displayName: 'mock_displayName',
          releaseDate: 'mock_releaseDate',
          status: 'mock_status',
          workSummary: 'mock_workSummary',
          updatedOn: 'mock_updateOn',
        },
      ],
    })
    expect(next).toHaveBeenCalledWith()
  })
})
