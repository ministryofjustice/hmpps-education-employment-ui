/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'
import _ from 'lodash'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './jobDetailsController'
import addressLookup from '../../addressLookup'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import JobDetailsViewModel from '../../../viewModels/jobDetailsViewModel'

describe('HomePageController', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'MOCK_USER' }

  req.context.profile = {}
  req.context.jobDetails = {
    sector: 'OUTDOOR',
  }
  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.context.prisonerAddress = {
    postcode: 'mock_postcode',
  }

  req.params.id = 'mock_ref'
  const { id } = req.params

  const mockData = {
    id,
    backLocation: addressLookup.candidateMatching.matchedJobs(id),
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    job: plainToClass(JobDetailsViewModel, req.context.jobDetails),
    releaseArea: {
      postcode: 'mock_postcode',
    },
  }

  const mockService: any = {
    createArchiveRecord: jest.fn(),
    deleteArchiveRecord: jest.fn(),
    createExpressionOfInterest: jest.fn(),
    deleteExpressionOfInterest: jest.fn(),
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

    it('On success - Matching work type - Calls render with the correct data', async () => {
      _.set(req.context.profile, 'profileData.supportAccepted.workInterests.workTypesOfInterest', 'OUTDOOR')

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/jobDetails/index', {
        ...mockData,
        matchesPrisonerInterests: true,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Not a work type - Calls render with the correct data', async () => {
      _.set(req.context.profile, 'profileData.supportAccepted.workInterests.workTypesOfInterest', 'BUILDING')

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/jobDetails/index', {
        ...mockData,
        matchesPrisonerInterests: false,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    beforeEach(() => {
      res.redirect.mockReset()
      next.mockReset()
      req.body = {}
      mockService.createArchiveRecord.mockReset()
    })

    it('On error - Calls next with error', async () => {
      const error = new Error('mock_error')
      mockService.createArchiveRecord.mockImplementation(() => {
        throw error
      })

      req.body.createArchiveRecord = ''

      controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })

    it('On success - createArchiveRecord - Calls createArchiveRecord and redirects', async () => {
      req.body.createArchiveRecord = ''

      controller.post(req, res, next)

      expect(mockService.createArchiveRecord).toHaveBeenCalledTimes(1)
    })

    it('On success - deleteArchiveRecord - Calls deleteArchiveRecord and redirects', async () => {
      req.body.deleteArchiveRecord = ''

      controller.post(req, res, next)

      expect(mockService.deleteArchiveRecord).toHaveBeenCalledTimes(1)
    })

    it('On success - createExpressionOfInterest - Calls createExpressionOfInterest and redirects', async () => {
      req.body.createExpressionOfInterest = ''

      controller.post(req, res, next)

      expect(mockService.createExpressionOfInterest).toHaveBeenCalledTimes(1)
    })

    it('On success - deleteExpressionOfInterest - Calls deleteExpressionOfInterest and redirects', async () => {
      req.body.deleteExpressionOfInterest = ''

      controller.post(req, res, next)

      expect(mockService.deleteExpressionOfInterest).toHaveBeenCalledTimes(1)
    })
  })
})
