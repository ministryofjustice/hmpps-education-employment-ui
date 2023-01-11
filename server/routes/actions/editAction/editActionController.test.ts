/* eslint-disable @typescript-eslint/no-explicit-any */

import { plainToClass } from 'class-transformer'
import expressMocks from '../../../testutils/expressMocks'
import Controller from './editActionController'
import addressLookup from '../../addressLookup'
import { setSessionData } from '../../../utils/session'
import ProfileStatus from '../../../enums/profileStatus'
import validateFormSchema from '../../../utils/validateFormSchema'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'

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
      supportAccepted: {
        actionsRequired: {
          actions: [{ todoItem: 'CV', status: 'IN_PROGRESS' }],
        },
      },
    },
  }

  req.params.id = 'mock_ref'
  req.params.action = 'cv'
  req.originalUrl = 'mock_url'
  res.locals.user = {}
  const { id } = req.params

  const mockData = {
    backLocation: addressLookup.workProfile(id),
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    toDoItem: 'CV',
    toDoStatus: 'IN_PROGRESS',
  }

  const mockService: any = {
    updateProfile: jest.fn(),
  }

  const controller = new Controller(mockService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['editAction', id, 'data'], mockData)
      setSessionData(req, ['actions', id], {})
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
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
      setSessionData(req, ['editAction', id, 'data'], mockData)
      setSessionData(req, ['actions', id], {})
      mockService.updateProfile.mockResolvedValue({})
    })

    it('On error - Calls next with error', async () => {
      validationMock.mockImplementation(() => {
        throw new Error('mock_error')
      })

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })

    it('On validation error - Calls render with the correct data', async () => {
      validationMock.mockImplementation(() => errors)

      await controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/actions/editAction/index', { ...mockData, errors })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })
})
