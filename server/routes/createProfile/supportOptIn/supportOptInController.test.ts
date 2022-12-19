import { plainToClass } from 'class-transformer'
import expressMocks from '../../../testutils/expressMocks'
import Controller from './supportOptInController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import YesNoValue from '../../../enums/yesNoValue'
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

describe('SupportOptInController', () => {
  const { req, res, next } = expressMocks()

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id, mode } = req.params

  const mockData = {
    backLocation: addressLookup.createProfile.rightToWork(id, mode),
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['supportOptIn', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/supportOptIn/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found - Calls render with the correct data', async () => {
      setSessionData(req, ['createProfile', id], { supportOptIn: YesNoValue.YES })
      req.params.mode = 'edit'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/supportOptIn/index', {
        ...mockData,
        backLocation: addressLookup.createProfile.checkAnswers(id),
        supportOptIn: YesNoValue.YES,
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
      setSessionData(req, ['supportOptIn', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/supportOptIn/index', { ...mockData, errors })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - supportOptIn = NO - Sets session record then redirects to noSupportReason', async () => {
      req.body.supportOptIn = YesNoValue.NO
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.supportDeclinedReason(id, 'new'))
      expect(getSessionData(req, ['supportOptIn', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createProfile', id])).toEqual({ supportOptIn: YesNoValue.NO })
    })

    it('On success - supportOptIn = YES and mode = new - Sets session record then redirects to alreadyInPlace', async () => {
      req.body.supportOptIn = YesNoValue.YES
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({ supportOptIn: YesNoValue.YES })
      expect(getSessionData(req, ['supportOptIn', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.alreadyInPlace(id, 'new'))
    })

    it('On success - supportOptIn = YES and mode = edit - Sets session record then redirects to checkAnswers', async () => {
      req.body.supportOptIn = YesNoValue.YES
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({ supportOptIn: YesNoValue.YES })
      expect(getSessionData(req, ['supportOptIn', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.checkAnswers(id))
    })

    it('On success - supportOptIn changed and mode = edit - Sets session record then redirects to checkAnswers in new mode', async () => {
      setSessionData(req, ['createProfile', id], { supportOptIn: YesNoValue.YES })
      req.body.supportOptIn = YesNoValue.NO
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({
        rightToWork: YesNoValue.YES,
        supportOptIn: YesNoValue.NO,
      })
      expect(getSessionData(req, ['supportOptIn', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.supportDeclinedReason(id, 'new'))
    })
  })
})
