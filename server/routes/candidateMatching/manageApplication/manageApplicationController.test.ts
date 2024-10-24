/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './manageApplicationController'
import addressLookup from '../../addressLookup'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import JobDetailsViewModel from '../../../viewModels/jobDetailsViewModel'
import ApplicationStatusViewModel from '../../../viewModels/applicationProgressViewModel'
import validateFormSchema from '../../../utils/validateFormSchema'
import { setSessionData } from '../../../utils/session'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('ManageApplicationController', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'MOCK_USER' }

  req.context.profile = {}
  req.context.manageApplication = {
    typeOfWork: 'OUTDOOR',
  }
  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }
  req.context.applicationProgress = []
  req.params.id = 'mock_ref'
  req.params.jobId = '1'
  req.params.mode = 'update'
  res.locals.userActiveCaseLoad = {
    caseLoadId: 'MDI',
  }
  const { id, jobId } = req.params

  const mockData = {
    id,
    backLocation: addressLookup.candidateMatching.jobDetails(id, jobId),
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    job: plainToClass(JobDetailsViewModel, req.context.jobDetails),
    mode: 'update',
    applicationProgress: plainToClass(ApplicationStatusViewModel, req.context.applicationProgress),
  }

  const mockService: any = {
    updateApplicationProgress: jest.fn(),
  }

  const controller = new Controller(mockService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - Calls render with the correct data', async () => {
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/manageApplication/index', {
        ...mockData,
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
      setSessionData(req, ['manageApplication', id, jobId], mockData)
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
      req.body.additionalInformation = 'test_data'

      controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/manageApplication/index', {
        ...mockData,
        additionalInformation: 'test_data',
        errors,
      })
    })

    it('On successful POST - redirects to manageApplication in update mode', async () => {
      req.body.applicationStatus = 'APPLICATION_MADE'
      req.body.additionalInformation = 'test_data'

      req.context.applicationProgress = [{ id: 'mock_id' }]

      controller.post(req, res, next)

      expect(mockService.updateApplicationProgress).toHaveBeenCalledTimes(1)
      expect(mockService.updateApplicationProgress).toHaveBeenCalledWith('MOCK_USER', 'mock_id', {
        additionalInformation: 'test_data',
        applicationStatus: 'APPLICATION_MADE',
        firstName: 'mock_firstName',
        jobId: '1',
        lastName: 'mock_lastName',
        prisonNumber: 'mock_ref',
        prisonId: 'MDI',
      })
    })
  })
})
