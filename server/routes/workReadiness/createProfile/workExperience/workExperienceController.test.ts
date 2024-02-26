/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../../testutils/expressMocks'
import Controller from './workExperienceController'
import validateFormSchema from '../../../../utils/validateFormSchema'
import addressLookup from '../../../addressLookup'
import YesNoValue from '../../../../enums/yesNoValue'
import { getSessionData, setSessionData } from '../../../../utils/session'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import workProfileTabs from '../../../../enums/workProfileTabs'
import pageTitleLookup from '../../../../utils/pageTitleLookup'

jest.mock('../../../../utils/pageTitleLookup', () => ({
  ...jest.requireActual('../../../../utils/pageTitleLookup'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('../../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('./validationSchema', () => ({
  ...jest.requireActual('./validationSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('WorkExperienceController', () => {
  const { req, res, next } = expressMocks()

  const pageTitleLookupMock = pageTitleLookup as jest.Mock
  pageTitleLookupMock.mockReturnValue('mock_page_title')

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id, mode } = req.params

  const mockData = {
    backLocation: addressLookup.workReadiness.createProfile.jobOfParticularInterest(id, mode),
    backLocationAriaText: 'Back to mock_page_title',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
  }

  res.locals.user = {}

  const mockService: any = {
    updateProfile: jest.fn(),
  }

  const controller = new Controller(mockService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['workExperience', id, 'data'], mockData)
      setSessionData(req, ['createProfile', id], {})
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - No record found - Calls render with the correct data', async () => {
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/workReadiness/createProfile/workExperience/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found - Calls render with the correct data', async () => {
      setSessionData(req, ['createProfile', id], { workExperience: YesNoValue.YES })
      req.params.mode = 'new'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/workReadiness/createProfile/workExperience/index', {
        ...mockData,
        workExperience: YesNoValue.YES,
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
      setSessionData(req, ['workExperience', id, 'data'], mockData)
      setSessionData(req, ['createProfile', id], {})
    })

    it('On error - Calls next with error', async () => {
      validationMock.mockImplementation(() => {
        throw new Error('mock_error')
      })

      controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })

    it('On validation error - Calls render with the correct data', async () => {
      validationMock.mockImplementation(() => errors)

      controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/workReadiness/createProfile/workExperience/index', {
        ...mockData,
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - mode = new - Sets session record then redirects to trainingAndQualifications', async () => {
      req.body.workExperience = YesNoValue.YES
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({
        workExperience: YesNoValue.YES,
      })
      expect(getSessionData(req, ['workExperience', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(
        addressLookup.workReadiness.createProfile.trainingAndQualifications(id, 'new'),
      )
    })

    it('On success - mode = edit - Sets session record then redirects to checkAnswers', async () => {
      req.body.workExperience = YesNoValue.YES
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({
        workExperience: YesNoValue.YES,
      })
      expect(getSessionData(req, ['workExperience', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workReadiness.createProfile.checkAnswers(id))
    })

    it('On success - mode = update - calls api and redirects to workProfile', async () => {
      req.context.profile = {
        profileData: {
          supportAccepted: {
            workExperience: {},
          },
        },
      }
      req.body.workExperience = YesNoValue.YES
      req.body.workExperienceDetails = 'Some details'
      req.params.mode = 'update'

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(mockService.updateProfile).toBeCalledTimes(1)
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workReadiness.workProfile(id, workProfileTabs.EXPERIENCE))
    })
  })
})
