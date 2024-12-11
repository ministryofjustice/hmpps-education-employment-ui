/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata'
import getPrisonerListApplicationsResolver from './getPrisonerListApplicationsResolver'
import getPrisonerListApplications from './utils/getPrisonerListApplications'
import JobApplicationService from '../../services/jobApplicationService'
import logger from '../../../logger'

jest.mock('./utils/getPrisonerListApplications')
jest.mock('../../../logger')

describe('getPrisonerListApplicationsResolver', () => {
  const mockJobApplicationService = {} as JobApplicationService
  const mockRequest: any = { query: {}, context: {} }
  const mockResponse: any = {
    locals: {
      userActiveCaseLoad: { caseLoadId: 'P123' },
      user: { username: 'mock_username' },
    },
  }
  const mockNext = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('On success - sets applications in context and calls next()', async () => {
    const mockApplications = {
      content: [{ prisonerId: 'A1234BC', name: 'John Doe', job: 'Cleaner', status: 'APPLIED' }],
      page: { size: 1, number: 1, totalElements: 1, totalPages: 1 },
    }
    ;(getPrisonerListApplications as jest.Mock).mockResolvedValue(mockApplications)

    const resolver = getPrisonerListApplicationsResolver(mockJobApplicationService)
    await resolver(mockRequest, mockResponse, mockNext)

    expect(getPrisonerListApplications).toHaveBeenCalledWith(mockJobApplicationService, 'mock_username', {
      prisonId: 'P123',
      page: 1,
      sort: '',
      order: '',
      applicationStatusFilter: '',
      prisonerNameFilter: '',
      jobFilter: '',
    })
    expect(mockRequest.context.prisonerListApplications).toEqual(mockApplications)
    expect(mockNext).toHaveBeenCalled()
  })

  it('On error - logs error and calls next with error', async () => {
    const mockError = new Error('Test error')
    ;(getPrisonerListApplications as jest.Mock).mockRejectedValue(mockError)

    const resolver = getPrisonerListApplicationsResolver(mockJobApplicationService)
    await resolver(mockRequest, mockResponse, mockNext)

    expect(logger.error).toHaveBeenCalledWith('Error getting data - Prisoner list applications')
    expect(mockNext).toHaveBeenCalledWith(mockError)
  })

  it('Applies plainToClass transformation for application content', async () => {
    const mockApplications = {
      content: [{ prisonerId: 'A1234BC', name: 'John Doe', job: 'Cleaner', status: 'APPLIED' }],
      page: { size: 1, number: 1, totalElements: 1, totalPages: 1 },
    }
    ;(getPrisonerListApplications as jest.Mock).mockResolvedValue(mockApplications)

    const resolver = getPrisonerListApplicationsResolver(mockJobApplicationService)
    await resolver(mockRequest, mockResponse, mockNext)

    expect(mockRequest.context.prisonerListApplications.content).toEqual(mockApplications.content)
  })
})
