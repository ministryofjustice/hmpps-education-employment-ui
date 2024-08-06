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

  const controller = new Controller()

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
})
