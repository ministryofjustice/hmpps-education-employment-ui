/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../../testutils/expressMocks'
import Controller from './newStatusPauseController'
import addressLookup from '../../addressLookup'
import { setSessionData } from '../../../utils/session'

import ProfileStatus from '../../../enums/profileStatus'

describe('NewStatusPauseController', () => {
  const { req, res, next } = expressMocks()

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  const { id } = req.params

  // const mockData = {
  //   backLocation: addressLookup.changeStatus.newStatus(id),
  //   prisoner: req.context.prisoner,
  // }

  res.locals.user = {}

  const mockService: any = {
    changeStatus: jest.fn(),
  }

  const controller = new Controller(mockService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['changeStatus', id], { newStatus: ProfileStatus.NO_RIGHT_TO_WORK })
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    // it('On success - Calls render with the correct data', async () => {
    //   controller.get(req, res, next)

    //   expect(res.render).toHaveBeenCalledWith('pages/changeStatus/newStatusPause/index', { ...mockData })
    //   expect(next).toHaveBeenCalledTimes(0)
    // })
  })

  // describe('#post(req, res)', () => {
  //   beforeEach(() => {
  //     res.render.mockReset()
  //     res.redirect.mockReset()
  //     next.mockReset()
  //     mockService.changeStatus.mockReset()
  //     setSessionData(req, ['changeStatus', id], {})
  //   })
  //   it('On error - Calls next with error', async () => {
  //     mockService.changeStatus.mockImplementation(() => {
  //       throw new Error('mock_error')
  //     })

  //     await controller.post(req, res, next)

  //     expect(next).toHaveBeenCalledTimes(1)
  //     expect(res.render).toHaveBeenCalledTimes(0)
  //   })
  //   it('On success - Calls create profile, tidy session and redirects to workProfile', async () => {
  //     mockService.changeStatus.mockResolvedValue({})

  //     await controller.post(req, res, next)

  //     expect(mockService.changeStatus).toHaveBeenCalledTimes(1)
  //     expect(res.redirect).toHaveBeenCalledTimes(1)
  //     expect(getSessionData(req, ['changeStatus', id])).toBeFalsy()
  //   })
  // })
})
