import expressMocks from '../../../testutils/expressMocks'
import Controller from './alreadyInPlaceController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
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
    backLocation: addressLookup.createProfile.supportOptIn(id, mode),
    prisoner: req.context.prisoner,
    alreadyInPlace: [] as any,
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      req.session.data[`alreadyInPlace_${id}_data`] = mockData
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

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/alreadyInPlace/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found - Calls render with the correct data', async () => {
      req.session.data[`createProfile_${id}`] = { alreadyInPlace: alreadyInPlaceValue.HOUSING }
      req.params.mode = 'edit'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/alreadyInPlace/index', {
        ...mockData,
        backLocation: addressLookup.createProfile.checkAnswers(id),
        alreadyInPlace: alreadyInPlaceValue.HOUSING,
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
      req.session.data[`alreadyInPlace_${id}_data`] = mockData
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

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/alreadyInPlace/index', {
        ...mockData,
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - mode = new and value = ID - Sets session record then redirects to identification', async () => {
      req.body.alreadyInPlace = alreadyInPlaceValue.ID
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(req.session.data[`createProfile_${id}`]).toEqual({
        alreadyInPlace: alreadyInPlaceValue.ID,
      })
      expect(req.session.data[`alreadyInPlace_${id}_data`]).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.identification(id, 'new'))
    })

    it('On success - mode = edit and value = ID - Sets session record then redirects to identification', async () => {
      req.body.alreadyInPlace = alreadyInPlaceValue.ID
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(req.session.data[`createProfile_${id}`]).toEqual({
        alreadyInPlace: alreadyInPlaceValue.ID,
      })
      expect(req.session.data[`alreadyInPlace_${id}_data`]).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.identification(id, 'edit'))
    })

    it('On success - mode = new and value != ID - Sets session record then redirects to identification', async () => {
      req.body.alreadyInPlace = alreadyInPlaceValue.HOUSING
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(req.session.data[`createProfile_${id}`]).toEqual({
        alreadyInPlace: alreadyInPlaceValue.HOUSING,
      })
      expect(req.session.data[`alreadyInPlace_${id}_data`]).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.affectAbilityToWork(id, 'new'))
    })

    it('On success - mode = edit and value != ID - Sets session record then redirects to checkAnswers', async () => {
      req.body.alreadyInPlace = alreadyInPlaceValue.HOUSING
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(req.session.data[`createProfile_${id}`]).toEqual({
        alreadyInPlace: alreadyInPlaceValue.HOUSING,
      })
      expect(req.session.data[`alreadyInPlace_${id}_data`]).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.checkAnswers(id))
    })
  })
})
