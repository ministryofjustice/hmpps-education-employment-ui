import expressMocks from '../../../testutils/expressMocks'
import Controller from './RightToWorkController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import YesNoValue from '../../../enums/YesNoValue'

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

describe('RightToWorkController', () => {
  const { req, res, next } = expressMocks()

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id } = req.params

  const mockData = {
    backLocation: addressLookup.workProfile(id),
    prisoner: req.context.prisoner,
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      req.session.data[`rightToWork_${id}_data`] = mockData
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

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/rightToWork/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found - Calls render with the correct data', async () => {
      req.session.data[`createProfile_${id}`] = { rightToWork: YesNoValue.Yes }
      req.params.mode = 'edit'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/rightToWork/index', {
        ...mockData,
        backLocation: addressLookup.createProfile.checkAnswers(id),
        rightToWork: YesNoValue.Yes,
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
      req.session.data[`rightToWork_${id}_data`] = mockData
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

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/rightToWork/index', { ...mockData, errors })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - rightToWork = NO - Sets session record then redirects to ineligableToWork', async () => {
      req.body.rightToWork = YesNoValue.No

      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.ineligableToWork(id))
      expect(req.session.data[`rightToWork_${id}_data`]).toBeFalsy()
      expect(req.session.data[`createProfile_${id}`]).toEqual({ rightToWork: YesNoValue.No })
    })

    it('On success - rightToWork = YES and mode = new - Sets session record then redirects to supportOptIn', async () => {
      req.body.rightToWork = YesNoValue.Yes
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(req.session.data[`createProfile_${id}`]).toEqual({ rightToWork: YesNoValue.Yes })
      expect(req.session.data[`rightToWork_${id}_data`]).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.supportOptIn(id, 'new'))
    })

    it('On success - rightToWork = YES and mode = edit - Sets session record then redirects to checkAnswers', async () => {
      req.body.rightToWork = YesNoValue.Yes
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(req.session.data[`createProfile_${id}`]).toEqual({ rightToWork: YesNoValue.Yes })
      expect(req.session.data[`rightToWork_${id}_data`]).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.createProfile.checkAnswers(id))
    })
  })
})
