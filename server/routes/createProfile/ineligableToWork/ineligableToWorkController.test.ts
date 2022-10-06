import expressMocks from '../../../testutils/expressMocks'
import Controller from './ineligableToWorkController'
import addressLookup from '../../addressLookup'

describe('IneligableToWorkController', () => {
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
    prisoner: req.context.prisoner,
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      req.session.data[`createProfile_${id}`] = { rightToWork: 'NO' }
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - Calls render with the correct data', async () => {
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/createProfile/ineligableToWork/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    const errors = { details: 'mock_error' }

    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
    })

    // it('On error - Calls next with error', async () => {
    //   validationMock.mockImplementation(() => {
    //     throw new Error('mock_error')
    //   })

    //   controller.post(req, res, next)

    //   expect(next).toHaveBeenCalledTimes(1)
    //   expect(res.render).toHaveBeenCalledTimes(0)
    // })

    it('On success - Calls api and redirects to work-profile', async () => {
      controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workProfile(id))
      expect(req.session.data[`createProfile_${id}`]).toBeFalsy()
    })
  })
})
