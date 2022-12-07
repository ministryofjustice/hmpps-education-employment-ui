import expressMocks from '../../../testutils/expressMocks'
import Controller from './newStatusController'
import addressLookup from '../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../utils/session'
import ProfileStatus from '../../../enums/profileStatus'
import validateFormSchema from '../../../utils/validateFormSchema'

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
    profileData: {
      status: ProfileStatus.NO_RIGHT_TO_WORK,
    },
  }

  req.params.id = 'mock_ref'
  req.originalUrl = 'mock_url'
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

    it('On success - Record found - Calls render with the correct data', async () => {
      setSessionData(req, ['changeStatus', id], { newStatus: ProfileStatus.READY_TO_WORK })

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/changeStatus/newStatus/index', {
        ...mockData,
        newStatus: ProfileStatus.READY_TO_WORK,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - No record found - Calls render with the correct data', async () => {
      deleteSessionData(req, ['changeStatus', id])

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/changeStatus/newStatus/index', {
        ...mockData,
        newStatus: ProfileStatus.NO_RIGHT_TO_WORK,
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
      setSessionData(req, ['newStatus', id, 'data'], mockData)
      setSessionData(req, ['changeStatus', id], {})
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

      expect(res.render).toHaveBeenCalledWith('pages/changeStatus/newStatus/index', { ...mockData, errors })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - status === newStatus - redirects to workProfile', async () => {
      req.context.profile.profileData.status = ProfileStatus.READY_TO_WORK
      req.body.newStatus = ProfileStatus.READY_TO_WORK

      controller.post(req, res, next)

      expect(getSessionData(req, ['newStatus', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workProfile(id))
    })

    it('On success - status = SUPPORT_DECLINED to newStatus = NO_RIGHT_TO_WORK - Updates status and redirect to workProfile', async () => {
      req.context.profile.profileData.status = ProfileStatus.SUPPORT_DECLINED
      req.body.newStatus = ProfileStatus.NO_RIGHT_TO_WORK

      controller.post(req, res, next)

      expect(getSessionData(req, ['newStatus', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workProfile(id))
    })

    it('On success - status = SUPPORT_NEEDED to newStatus = NO_RIGHT_TO_WORK - Updates status and redirect to workProfile', async () => {
      req.context.profile.profileData.status = ProfileStatus.SUPPORT_NEEDED
      req.body.newStatus = ProfileStatus.NO_RIGHT_TO_WORK

      controller.post(req, res, next)

      expect(getSessionData(req, ['newStatus', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workProfile(id))
    })

    it('On success - status = READY_TO_WORK to newStatus = NO_RIGHT_TO_WORK - Updates status and redirect to workProfile', async () => {
      req.context.profile.profileData.status = ProfileStatus.READY_TO_WORK
      req.body.newStatus = ProfileStatus.NO_RIGHT_TO_WORK

      controller.post(req, res, next)

      expect(getSessionData(req, ['newStatus', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workProfile(id))
    })

    it('On success - status = NO_RIGHT_TO_WORK to newStatus = SUPPORT_DECLINED - Updates status and redirect to supportDeclinedReason', async () => {
      req.context.profile.profileData.status = ProfileStatus.NO_RIGHT_TO_WORK
      req.body.newStatus = ProfileStatus.SUPPORT_DECLINED

      controller.post(req, res, next)

      expect(getSessionData(req, ['newStatus', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createProfile.supportDeclinedReason(id)}?from=mock_url`,
      )
    })

    it('On success - status = SUPPORT_NEEDED to newStatus = SUPPORT_DECLINED - Updates status and redirect to supportDeclinedReason', async () => {
      req.context.profile.profileData.status = ProfileStatus.SUPPORT_NEEDED
      req.body.newStatus = ProfileStatus.SUPPORT_DECLINED

      controller.post(req, res, next)

      expect(getSessionData(req, ['newStatus', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createProfile.supportDeclinedReason(id)}?from=mock_url`,
      )
    })

    it('On success - status = READY_TO_WORK to newStatus = SUPPORT_DECLINED - Updates status and redirect to supportDeclinedReason', async () => {
      req.context.profile.profileData.status = ProfileStatus.READY_TO_WORK
      req.body.newStatus = ProfileStatus.SUPPORT_DECLINED

      controller.post(req, res, next)

      expect(getSessionData(req, ['newStatus', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createProfile.supportDeclinedReason(id)}?from=mock_url`,
      )
    })

    it('On success - status = NO_RIGHT_TO_WORK to newStatus = SUPPORT_NEEDED - Updates status and redirect to newStatusPause', async () => {
      req.context.profile.profileData.status = ProfileStatus.NO_RIGHT_TO_WORK
      req.body.newStatus = ProfileStatus.SUPPORT_NEEDED

      controller.post(req, res, next)

      expect(getSessionData(req, ['newStatus', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.changeStatus.newStatusPause(id))
    })

    it('On success - status = SUPPORT_DECLINED to newStatus = SUPPORT_NEEDED - Updates status and redirect to newStatusPause', async () => {
      req.context.profile.profileData.status = ProfileStatus.SUPPORT_DECLINED
      req.body.newStatus = ProfileStatus.SUPPORT_NEEDED

      controller.post(req, res, next)

      expect(getSessionData(req, ['newStatus', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.changeStatus.newStatusPause(id))
    })

    it('On success - status = READY_TO_WORK to newStatus = SUPPORT_NEEDED - Updates status and redirect to newStatusPause', async () => {
      req.context.profile.profileData.status = ProfileStatus.READY_TO_WORK
      req.body.newStatus = ProfileStatus.SUPPORT_NEEDED

      controller.post(req, res, next)

      expect(getSessionData(req, ['newStatus', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.changeStatus.newStatusPause(id))
    })

    it('On success - status = NO_RIGHT_TO_WORK to newStatus = READY_TO_WORK - Updates status and redirect to newStatusPause', async () => {
      req.context.profile.profileData.status = ProfileStatus.NO_RIGHT_TO_WORK
      req.body.newStatus = ProfileStatus.READY_TO_WORK

      controller.post(req, res, next)

      expect(getSessionData(req, ['newStatus', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.changeStatus.newStatusPause(id))
    })

    it('On success - status = SUPPORT_DECLINED to newStatus = READY_TO_WORK - Updates status and redirect to newStatusPause', async () => {
      req.context.profile.profileData.status = ProfileStatus.SUPPORT_DECLINED
      req.body.newStatus = ProfileStatus.READY_TO_WORK

      controller.post(req, res, next)

      expect(getSessionData(req, ['newStatus', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.changeStatus.newStatusPause(id))
    })

    it('On success - status = SUPPORT_NEEDED to newStatus = READY_TO_WORK - Updates status and redirect to newStatusPause', async () => {
      req.context.profile.profileData.status = ProfileStatus.SUPPORT_NEEDED
      req.body.newStatus = ProfileStatus.READY_TO_WORK

      controller.post(req, res, next)

      expect(getSessionData(req, ['newStatus', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.changeStatus.newStatusPause(id))
    })
  })
})
