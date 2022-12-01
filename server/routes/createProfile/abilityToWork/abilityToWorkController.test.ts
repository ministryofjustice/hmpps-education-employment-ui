/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './abilityToWorkController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'
import AlreadyInPlaceValue from '../../../enums/alreadyInPlaceValue'
import { getSessionData, setSessionData } from '../../../utils/session'

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
    backLocation: addressLookup.createProfile.alreadyInPlace(id, mode),
    prisoner: req.context.prisoner,
    abilityToWork: [] as any,
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['abilityToWork', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/abilityToWork/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found - Calls render with the correct data', async () => {
      setSessionData(req, ['createProfile', id], { abilityToWork: AbilityToWorkValue.EDUCATION_ENROLLMENT })
      req.params.mode = 'edit'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/abilityToWork/index', {
        ...mockData,
        backLocation: addressLookup.createProfile.checkAnswers(id),
        abilityToWork: AbilityToWorkValue.EDUCATION_ENROLLMENT,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found from identification - Calls render with the correct data', async () => {
      setSessionData(req, ['createProfile', id], {
        abilityToWork: AbilityToWorkValue.EDUCATION_ENROLLMENT,
        alreadyInPlace: AlreadyInPlaceValue.ID,
      })
      req.params.mode = 'new'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/abilityToWork/index', {
        ...mockData,
        backLocation: addressLookup.createProfile.identification(id, 'new'),
        abilityToWork: AbilityToWorkValue.EDUCATION_ENROLLMENT,
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
      setSessionData(req, ['abilityToWork', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/abilityToWork/index', {
        ...mockData,
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - mode = new and value = DEPENDENCY_ISSUES - Sets session record then redirects to manageDrugsAndAlcohol', async () => {
      req.body.abilityToWork = AbilityToWorkValue.DEPENDENCY_ISSUES
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({
        abilityToWork: AbilityToWorkValue.DEPENDENCY_ISSUES,
      })
      expect(getSessionData(req, ['abilityToWork', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.manageDrugsAndAlcohol(id, 'new'))
    })

    it('On success - mode = edit and value = DEPENDENCY_ISSUES - Sets session record then redirects to manageDrugsAndAlcohol', async () => {
      req.body.abilityToWork = AbilityToWorkValue.DEPENDENCY_ISSUES
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({
        abilityToWork: AbilityToWorkValue.DEPENDENCY_ISSUES,
      })
      expect(getSessionData(req, ['abilityToWork', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.manageDrugsAndAlcohol(id, 'edit'))
    })

    it('On success - mode = new and value != ID - Sets session record then redirects to typeOfWork', async () => {
      req.body.abilityToWork = AbilityToWorkValue.EDUCATION_ENROLLMENT
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({
        abilityToWork: AbilityToWorkValue.EDUCATION_ENROLLMENT,
      })
      expect(getSessionData(req, ['abilityToWork', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.typeOfWork(id, 'new'))
    })

    it('On success - mode = edit and value != ID - Sets session record then redirects to checkAnswers', async () => {
      req.body.abilityToWork = AbilityToWorkValue.EDUCATION_ENROLLMENT
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({
        abilityToWork: AbilityToWorkValue.EDUCATION_ENROLLMENT,
      })
      expect(getSessionData(req, ['abilityToWork', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.checkAnswers(id))
    })
  })
})
