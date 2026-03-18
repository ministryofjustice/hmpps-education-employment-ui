/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import { auditService } from '@ministryofjustice/hmpps-audit-client'
import expressMocks from '../../../testutils/expressMocks'
import Controller from './manageApplicationController'
import addressLookup from '../../addressLookup'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import JobDetailsViewModel from '../../../viewModels/jobDetailsViewModel'
import ApplicationStatusViewModel from '../../../viewModels/applicationProgressViewModel'
import validateFormSchema from '../../../utils/validateFormSchema'
import { setSessionData } from '../../../utils/session'
import config from '../../../config'
import * as sessionModule from '../../../utils/session'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('../../../utils/session', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/session'),
  getSessionData: jest.fn(),
  setSessionData: jest.fn(), // optional, but good practice
}))

const mockGetSessionData = sessionModule.getSessionData as jest.Mock

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
    journey: 'manageMatchedJobs',
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
    const auditSpy = jest.spyOn(auditService, 'sendAuditMessage')

    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      validationMock.mockReset()
      setSessionData(req, ['manageApplication', id, jobId], mockData)

      config.apis.hmppsAudit.enabled = true
      auditSpy.mockReset()
      auditSpy.mockResolvedValue()
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

      expect(res.redirect).not.toHaveBeenCalled()
    })

    it('On validation error - Does not redirect when validation fails', async () => {
      const errors = { field: 'error' }

      ;(validateFormSchema as jest.Mock).mockReturnValue(errors)

      req.body = { additionalInformation: 'test' }

      await controller.post(req, res, next)

      expect(res.redirect).not.toHaveBeenCalled()
    })

    it('On successful POST - redirects to manageApplication in update mode', async () => {
      req.params = {
        id: '123',
        jobId: '456',
      }

      req.body = {
        applicationStatus: 'APPLICATION_MADE',
        additionalInformation: 'test_data',
      }

      mockGetSessionData.mockReturnValue({
        id: '123',
        jobId: '456',
        applicationProgress: [],
        backLocation: '/mjma/123/job/456/details',
        job: {},
        prisoner: { firstName: 'John', lastName: 'Doe' },
        mode: 'update',
      })

      req.context = {
        prisoner: { firstName: 'John', lastName: 'Doe' },
        applicationProgress: [{ id: 'mock_id' }],
      }

      res.locals = {
        user: { username: 'MOCK_USER' },
        userActiveCaseLoad: { caseLoadId: 'MDI' },
        withFrom: jest.fn(url => url),
      }

      await controller.post(req, res, next)

      expect(mockService.updateApplicationProgress).toHaveBeenCalledWith(
        'MOCK_USER',
        'mock_id',
        expect.objectContaining({
          jobId: '456',
          prisonNumber: '123',
          applicationStatus: 'APPLICATION_MADE',
          additionalInformation: 'test_data',
        }),
      )

      expect(res.redirect).toHaveBeenCalled()
    })

    it('On validation error - renders page with errors', async () => {
      const errors = { applicationStatus: { text: 'Select a status' } }

      validationMock.mockReturnValue(errors)

      mockGetSessionData.mockReturnValue({
        id: '123',
        jobId: '456',
        applicationProgress: [],
        backLocation: '/mjma/123/job/456/details',
        job: {},
        prisoner: { firstName: 'John', lastName: 'Doe' },
        mode: 'update',
      })

      req.params = { id: '123', jobId: '456' }

      req.body = {
        applicationStatus: '',
        additionalInformation: 'test_data',
      }

      req.context = {
        prisoner: { firstName: 'John', lastName: 'Doe' },
        applicationProgress: [],
      }

      res.locals = {
        user: { username: 'MOCK_USER' },
        userActiveCaseLoad: { caseLoadId: 'MDI' },
      }

      await controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/candidateMatching/manageApplication/index',
        expect.objectContaining({
          additionalInformation: 'test_data',
          errors,
        }),
      )

      expect(res.redirect).not.toHaveBeenCalled()
    })

    it('On successful POST - audits the update', async () => {
      req.body = {
        applicationStatus: 'APPLICATION_MADE',
        additionalInformation: 'test_data',
      }
      mockGetSessionData.mockReturnValue({
        id: '123',
        jobId: '456',
        applicationProgress: [],
        backLocation: '/mjma/123/job/456/details',
        job: {},
        prisoner: { firstName: 'John', lastName: 'Doe' },
        mode: 'update',
      })

      req.context.applicationProgress = [{ id: 'mock_id' }]

      await controller.post(req, res, next)

      expect(auditSpy).toHaveBeenCalledTimes(1)
      expect(auditSpy).toHaveBeenCalledWith({
        action: 'UPDATE_APPLICATION',
        who: res.locals.user.username,
        subjectId: 'mock_id',
        subjectType: 'NOT_APPLICABLE',
        service: 'hmpps-education-employment-ui',
        details: JSON.stringify({
          jobId: req.params.jobId,
          prisonNumber: req.params.id,
          applicationStatus: req.body.applicationStatus,
        }),
      })
    })

    it('redirects to applications list when returnToApplicationsList is present', async () => {
      req.body = { returnToApplicationsList: true }

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.candidateMatching.prisonerListApplications())
      expect(res.render).not.toHaveBeenCalled()
    })

    it('redirects to job matches list when returnToJobMatchesList is present', async () => {
      req.body = { returnToJobMatchesList: true }

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.candidateMatching.prisonerListMatchJobs()}?sort=releaseDate&order=ascending`,
      )
    })
  })
})
