import { plainToClass } from 'class-transformer'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './manageApplicationController'
import addressLookup from '../../addressLookup'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import JobDetailsViewModel from '../../../viewModels/jobDetailsViewModel'

describe('HomePageController', () => {
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

  req.params.id = 'mock_ref'
  req.params.jobId = '1'
  const { id, jobId } = req.params

  const mockData = {
    id,
    backLocation: addressLookup.candidateMatching.jobDetails(id, jobId),
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    job: plainToClass(JobDetailsViewModel, req.context.jobDetails),
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

    it('On success - Calls render with the correct data', async () => {
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/candidateMatching/manageApplication/index', {
        ...mockData,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })
})
