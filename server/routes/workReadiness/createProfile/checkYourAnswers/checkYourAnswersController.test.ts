/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../../testutils/expressMocks'
import Controller from './checkYourAnswersController'
import { setSessionData, getSessionData } from '../../../../utils/session'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'

describe('CheckYourAnswersController', () => {
  const { req, res, next } = expressMocks()

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id } = req.params

  const mockData = {
    id: 'mock_ref',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    record: { rightToWork: 'NO' },
    statusChange: false,
  }

  res.locals.user = {}

  const mockService: any = {
    createProfile: jest.fn(),
  }

  const controller = new Controller(mockService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['createProfile', id], { rightToWork: 'NO' })
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

      expect(res.render).toHaveBeenCalledWith('pages/workReadiness/createProfile/checkYourAnswers/index', {
        ...mockData,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      mockService.createProfile.mockReset()
      setSessionData(req, ['createProfile', id], {})
    })
    it('On error - Calls next with error', async () => {
      mockService.createProfile.mockImplementation(() => {
        throw new Error('mock_error')
      })
      await controller.post(req, res, next)
      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })
    it('On success - Calls createProfile, tidy session and redirects to workProfile', async () => {
      mockService.createProfile.mockResolvedValue({})

      await controller.post(req, res, next)

      // expect(mockService.createProfile).toHaveBeenCalledTimes(1)
      expect(res.redirect).toHaveBeenCalledTimes(1)
      expect(getSessionData(req, ['createProfile', id])).toBeFalsy()
    })

    it('On success - Calls createProfile with prisonId included in data', async () => {
      const mockPrisonId = 'MOCK_PRISON_ID'
      const mockToken = 'MOCK_TOKEN'
      const bookingId = 123456
      const prisonName = 'Mock Prison'

      // Set up required mock context
      res.locals.user = { username: 'USER1', token: mockToken }

      req.context.prisoner = {
        bookingId,
        prisonId: mockPrisonId,
        prisonName,
      }

      // Set up required session data
      setSessionData(req, ['createProfile', id], {
        prisoner: req.context.prisoner,
        record: {
          abilityToWork: 'YES',
          manageDrugsAndAlcohol: 'YES',
          alreadyInPlace: 'NONE',
          identification: 'ID',
          typeOfIdentificationDetails: '',
          rightToWork: 'NO',
          supportOptIn: 'NO',
          supportDeclinedReason: 'OTHER',
          supportDeclinedDetails: '',
          whatNeedsToChange: 'ATTITUDE',
          whatNeedsToChangeDetails: '',
          typeOfWork: ['TECH'],
          typeOfWorkDetails: '',
          jobOfParticularInterest: 'NO',
          jobOfParticularInterestDetails: '',
          workExperience: 'SOME',
          workExperienceDetails: '',
          trainingAndQualifications: 'YES',
          trainingAndQualificationsDetails: '',
        },
        statusChange: false,
      })

      mockService.createProfile.mockResolvedValue({})

      await controller.post(req, res, next)

      // Check prisonId is included in second argument
      expect(mockService.createProfile).toHaveBeenCalledWith(
        mockToken,
        expect.objectContaining({
          prisonId: mockPrisonId,
        }),
      )
    })
  })
})
