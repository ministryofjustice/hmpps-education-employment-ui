import { plainToClass } from 'class-transformer'
import expressMocks from '../../../../testutils/expressMocks'
import Controller from './rightToWorkController'
import validateFormSchema from '../../../../utils/validateFormSchema'
import addressLookup from '../../../addressLookup'
import YesNoValue from '../../../../enums/yesNoValue'
import { getSessionData, setSessionData } from '../../../../utils/session'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
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

describe('RightToWorkController', () => {
  const { req, res, next } = expressMocks()

  const pageTitleLookupMock = pageTitleLookup as jest.Mock
  pageTitleLookupMock.mockReturnValue('mock_page_title')

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id } = req.params

  const mockData = {
    backLocation: addressLookup.workProfile(id, 'overview'),
    backLocationAriaText: 'Back to mock_page_title',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['rightToWork', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/workReadiness/createProfile/rightToWork/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found - Calls render with the correct data', async () => {
      setSessionData(req, ['createProfile', id], { rightToWork: YesNoValue.YES })
      req.params.mode = 'edit'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/workReadiness/createProfile/rightToWork/index', {
        ...mockData,
        backLocation: addressLookup.workReadiness.createProfile.checkAnswers(id),
        rightToWork: YesNoValue.YES,
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
      setSessionData(req, ['rightToWork', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/workReadiness/createProfile/rightToWork/index', {
        ...mockData,
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - rightToWork = NO - Sets session record then redirects to ineligableToWork', async () => {
      req.body.rightToWork = YesNoValue.NO
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workReadiness.createProfile.ineligableToWork(id, 'new'))
      expect(getSessionData(req, ['rightToWork', id, 'data'])).toBeFalsy()
      expect(getSessionData(req, ['createProfile', id])).toEqual({ rightToWork: YesNoValue.NO })
    })

    it('On success - rightToWork = YES and mode = new - Sets session record then redirects to supportOptIn', async () => {
      req.body.rightToWork = YesNoValue.YES
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({ rightToWork: YesNoValue.YES })
      expect(getSessionData(req, ['rightToWork', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workReadiness.createProfile.supportOptIn(id, 'new'))
    })

    it('On success - rightToWork = YES and mode = edit - Sets session record then redirects to checkAnswers', async () => {
      req.body.rightToWork = YesNoValue.YES
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({ rightToWork: YesNoValue.YES })
      expect(getSessionData(req, ['rightToWork', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workReadiness.createProfile.checkAnswers(id))
    })
  })
})
