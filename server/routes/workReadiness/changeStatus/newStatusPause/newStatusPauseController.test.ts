/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'
import expressMocks from '../../../../testutils/expressMocks'
import Controller from './newStatusPauseController'
import { getSessionData, setSessionData } from '../../../../utils/session'
import ProfileStatus from '../../../../enums/profileStatus'
import addressLookup from '../../../addressLookup'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import pageTitleLookup from '../../../../utils/pageTitleLookup'
import { encryptUrlParameter } from '../../../../utils/urlParameterEncryption'

jest.mock('../../../../utils/pageTitleLookup', () => ({
  ...jest.requireActual('../../../../utils/pageTitleLookup'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('../../../../utils/urlParameterEncryption')

describe('NewStatusPauseController', () => {
  const { req, res, next } = expressMocks()

  const pageTitleLookupMock = pageTitleLookup as jest.Mock
  pageTitleLookupMock.mockReturnValue('mock_page_title')

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.params.id = 'mock_ref'
  req.originalUrl = 'mock_url'
  const { id } = req.params

  const mockData = {
    id: 'mock_ref',
    backLocation: addressLookup.changeStatus.newStatus(id),
    backLocationAriaText: 'Back to mock_page_title',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    newStatus: 'READY_TO_WORK',
  }

  res.locals.user = {}

  const mockService: any = {
    changeStatus: jest.fn(),
  }

  const controller = new Controller()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['changeStatus', id], { newStatus: ProfileStatus.READY_TO_WORK })
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

      expect(res.render).toHaveBeenCalledWith('pages/workReadiness/changeStatus/newStatusPause/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      mockService.changeStatus.mockReset()
      setSessionData(req, ['newStatusPause', id, 'data'], mockData)
    })

    it('On success - Calls create profile, tidy session and redirects to workProfile', async () => {
      await controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.createProfile.alreadyInPlace(id)}?from=${encryptUrlParameter(req.originalUrl)}`,
      )
      expect(getSessionData(req, ['newStatusPause', id, 'data'])).toBeFalsy()
    })
  })
})
