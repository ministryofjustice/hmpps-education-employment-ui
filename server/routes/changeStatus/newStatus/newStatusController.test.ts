import expressMocks from '../../../testutils/expressMocks'
import Controller from './newStatusController'
import validateFormSchema from '../../../utils/validateFormSchema'
import addressLookup from '../../addressLookup'
import { getSessionData, setSessionData } from '../../../utils/session'
import ProfileStatus from '../../../enums/profileStatus'

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

describe('NewStatusController', () => {
  const { req, res, next } = expressMocks()

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.context.profile = {
    status: ProfileStatus.NO_RIGHT_TO_WORK,
  }

  req.params.id = 'mock_ref'
  const { id } = req.params

  const mockData = {
    backLocation: addressLookup.workProfile(id),
    prisoner: req.context.prisoner,
    profile: req.context.profile,
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['newStatus', id, 'data'], mockData)
      setSessionData(req, ['changeStatus', id], {})
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    // it('On success - No record found - Calls render with the correct data', async () => {
    //   controller.get(req, res, next)

    //   expect(res.render).toHaveBeenCalledWith('pages/changeStatus/newStatus/index', { ...mockData })
    //   expect(next).toHaveBeenCalledTimes(0)
    // })

    // it('On success - Record found - Calls render with the correct data', async () => {
    //   setSessionData(req, ['changeStatus', id], { newStatus: ProfileStatus.NO_RIGHT_TO_WORK })

    //   controller.get(req, res, next)

    //   expect(res.render).toHaveBeenCalledWith('pages/changeStatus/newStatus/index', {
    //     ...mockData,
    //     backLocation: addressLookup.workProfile(id),
    //     newStatus: ProfileStatus.NO_RIGHT_TO_WORK,
    //   })
    //   expect(next).toHaveBeenCalledTimes(0)
    // })
  })

  // describe('#post(req, res)', () => {
  //   const errors = { details: 'mock_error' }

  //   const validationMock = validateFormSchema as jest.Mock

  //   beforeEach(() => {
  //     res.render.mockReset()
  //     res.redirect.mockReset()
  //     next.mockReset()
  //     validationMock.mockReset()
  //     setSessionData(req, ['newStatus', id, 'data'], mockData)
  //     setSessionData(req, ['changeStatus', id], {})
  //   })

  //   it('On error - Calls next with error', async () => {
  //     validationMock.mockImplementation(() => {
  //       throw new Error('mock_error')
  //     })

  //     controller.post(req, res, next)

  //     expect(next).toHaveBeenCalledTimes(1)
  //     expect(res.render).toHaveBeenCalledTimes(0)
  //   })

  //   it('On validation error - Calls render with the correct data', async () => {
  //     validationMock.mockImplementation(() => errors)

  //     controller.post(req, res, next)

  //     expect(res.render).toHaveBeenCalledWith('pages/changeStatus/newStatus/index', { ...mockData, errors })
  //     expect(next).toHaveBeenCalledTimes(0)
  //   })

  //   it('On success - newStatus = NO - Sets session record then redirects to ineligableToWork', async () => {
  //     req.body.newStatus = ProfileStatus.NO_RIGHT_TO_WORK

  //     controller.post(req, res, next)

  //     expect(res.redirect).toHaveBeenCalledWith(addressLookup.changeStatus.newStatusPause(id))
  //     expect(getSessionData(req, ['newStatus', id, 'data'])).toBeFalsy()
  //     expect(getSessionData(req, ['changeStatus', id])).toEqual({ newStatus: ProfileStatus.NO_RIGHT_TO_WORK })
  //   })
  // })
})
