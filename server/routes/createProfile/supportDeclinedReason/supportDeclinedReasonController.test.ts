/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../testutils/expressMocks'
import Controller from './supportDeclinedReasonController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import SupportDeclinedReasonValue from '../../../enums/supportDeclinedReasonValue'
import { getSessionData, setSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

jest.mock('../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('./validationSchema', () => ({
  ...jest.requireActual('./validationSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('SupportDeclinedReasonController', () => {
  const { req, res, next } = expressMocks()

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id, mode } = req.params

  const mockData = {
    backLocation: addressLookup.createProfile.supportOptIn(id, mode),
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    supportDeclinedReason: [] as any,
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
      setSessionData(req, ['supportDeclinedReason', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/supportDeclinedReason/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found - Calls render with the correct data', async () => {
      setSessionData(req, ['createProfile', id], { supportDeclinedReason: SupportDeclinedReasonValue.OTHER })
      req.params.mode = 'edit'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/supportDeclinedReason/index', {
        ...mockData,
        backLocation: addressLookup.createProfile.checkAnswers(id),
        supportDeclinedReason: SupportDeclinedReasonValue.OTHER,
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
      setSessionData(req, ['supportDeclinedReason', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/supportDeclinedReason/index', {
        ...mockData,
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - mode = new - Sets session record then redirects to whatNeedsToChange', async () => {
      req.body.supportDeclinedReason = SupportDeclinedReasonValue.OTHER
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({
        supportDeclinedReason: SupportDeclinedReasonValue.OTHER,
      })
      expect(getSessionData(req, ['supportDeclinedReason', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.whatNeedsToChange(id, 'new'))
    })

    it('On success - mode = edit - Sets session record then redirects to checkAnswers', async () => {
      req.body.supportDeclinedReason = SupportDeclinedReasonValue.OTHER
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({
        supportDeclinedReason: SupportDeclinedReasonValue.OTHER,
      })
      expect(getSessionData(req, ['supportDeclinedReason', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.checkAnswers(id))
    })

    it('On success - mode = update - calls api and redirects to workProfile', async () => {
      req.context.profile = {
        profileData: {
          supportDeclined: {},
        },
      }
      req.body.supportDeclinedReason = [SupportDeclinedReasonValue.OTHER]
      req.body.supportDeclinedDetails = 'Some details'
      req.params.mode = 'update'

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(mockService.updateProfile).toBeCalledTimes(1)
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workProfile(id))
    })
  })
})
