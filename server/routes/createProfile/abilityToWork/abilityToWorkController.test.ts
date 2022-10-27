/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './abilityToWorkController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import abilityToWorkValue from '../../../enums/abilityToWorkValue'
import alreadyInPlaceValue from '../../../enums/alreadyInPlaceValue'

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
      req.session.data[`abilityToWork_${id}_data`] = mockData
      req.session.data[`createProfile_${id}`] = {}
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
      req.session.data[`createProfile_${id}`] = { abilityToWork: abilityToWorkValue.EDUCATION_OR_TRAINING }
      req.params.mode = 'edit'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/abilityToWork/index', {
        ...mockData,
        backLocation: addressLookup.createProfile.checkAnswers(id),
        abilityToWork: abilityToWorkValue.EDUCATION_OR_TRAINING,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found from identification - Calls render with the correct data', async () => {
      req.session.data[`createProfile_${id}`] = {
        abilityToWork: abilityToWorkValue.EDUCATION_OR_TRAINING,
        alreadyInPlace: alreadyInPlaceValue.ID,
      }
      req.params.mode = 'new'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/abilityToWork/index', {
        ...mockData,
        backLocation: addressLookup.createProfile.identification(id, 'new'),
        abilityToWork: abilityToWorkValue.EDUCATION_OR_TRAINING,
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
      req.session.data[`abilityToWork_${id}_data`] = mockData
      req.session.data[`createProfile_${id}`] = {}
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

    it('On success - mode = new and value = DRUGS_OR_ALCOHOL - Sets session record then redirects to manageDrugsAndAlcohol', async () => {
      req.body.abilityToWork = abilityToWorkValue.DRUGS_OR_ALCOHOL
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(req.session.data[`createProfile_${id}`]).toEqual({
        abilityToWork: abilityToWorkValue.DRUGS_OR_ALCOHOL,
      })
      expect(req.session.data[`abilityToWork_${id}_data`]).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.manageDrugsAndAlcohol(id, 'new'))
    })

    it('On success - mode = edit and value = DRUGS_OR_ALCOHOL - Sets session record then redirects to manageDrugsAndAlcohol', async () => {
      req.body.abilityToWork = abilityToWorkValue.DRUGS_OR_ALCOHOL
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(req.session.data[`createProfile_${id}`]).toEqual({
        abilityToWork: abilityToWorkValue.DRUGS_OR_ALCOHOL,
      })
      expect(req.session.data[`abilityToWork_${id}_data`]).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.manageDrugsAndAlcohol(id, 'edit'))
    })

    it('On success - mode = new and value != ID - Sets session record then redirects to typeOfWork', async () => {
      req.body.abilityToWork = abilityToWorkValue.EDUCATION_OR_TRAINING
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(req.session.data[`createProfile_${id}`]).toEqual({
        abilityToWork: abilityToWorkValue.EDUCATION_OR_TRAINING,
      })
      expect(req.session.data[`abilityToWork_${id}_data`]).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.typeOfWork(id, 'new'))
    })

    it('On success - mode = edit and value != ID - Sets session record then redirects to checkAnswers', async () => {
      req.body.abilityToWork = abilityToWorkValue.EDUCATION_OR_TRAINING
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(req.session.data[`createProfile_${id}`]).toEqual({
        abilityToWork: abilityToWorkValue.EDUCATION_OR_TRAINING,
      })
      expect(req.session.data[`abilityToWork_${id}_data`]).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.checkAnswers(id))
    })
  })
})
