/* eslint-disable @typescript-eslint/no-explicit-any */
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { plainToClass } from 'class-transformer'

import expressMocks from '../../../../testutils/expressMocks'
import Controller from './typeOfWorkController'
import validateFormSchema from '../../../../utils/validateFormSchema'
import addressLookup from '../../../addressLookup'
import TypeOfWorkValue from '../../../../enums/typeOfWorkValue'
import { getSessionData, setSessionData } from '../../../../utils/session'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import workProfileTabs from '../../../../enums/workProfileTabs'
import pageTitleLookup from '../../../../utils/pageTitleLookup'
import config from '../../../../config'

jest.mock('../../../../utils/pageTitleLookup', () => ({
  ...jest.requireActual('../../../../utils/pageTitleLookup'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('../../../../utils/validateFormSchema', () => ({
  ...jest.requireActual('../../../../utils/validateFormSchema'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('./validationSchema', () => ({
  ...jest.requireActual('./validationSchema'),
  __esModule: true,
  default: jest.fn(),
}))

describe('TypeOfWorkController', () => {
  const { req, res, next } = expressMocks()

  const pageTitleLookupMock = pageTitleLookup as jest.Mock
  pageTitleLookupMock.mockReturnValue('mock_page_title')

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
    prisonerNumber: 'A1234AA',
  }

  req.params.id = 'mock_ref'
  req.params.mode = 'new'
  const { id, mode } = req.params

  const mockData = {
    backLocation: addressLookup.workReadiness.createProfile.abilityToWork(id, mode),
    backLocationAriaText: 'Back to mock_page_title',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    typeOfWork: [] as any,
  }

  res.locals.user = {}

  const mockService: any = {
    updateProfile: jest.fn(),
  }

  const controller = new Controller(mockService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['typeOfWork', id, 'data'], mockData)
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

      expect(res.render).toHaveBeenCalledWith('pages/workReadiness/createProfile/typeOfWork/index', { ...mockData })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - Record found - Calls render with the correct data', async () => {
      setSessionData(req, ['createProfile', id], { typeOfWork: TypeOfWorkValue.OTHER })
      req.params.mode = 'edit'

      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/workReadiness/createProfile/typeOfWork/index', {
        ...mockData,
        backLocation: addressLookup.workReadiness.createProfile.checkAnswers(id),
        typeOfWork: TypeOfWorkValue.OTHER,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })
  })

  describe('#post(req, res)', () => {
    const errors = { details: 'mock_error' }

    const validationMock = validateFormSchema as jest.Mock
    const auditSpy = jest.spyOn(auditService, 'sendAuditMessage')

    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      validationMock.mockReset()
      setSessionData(req, ['typeOfWork', id, 'data'], mockData)
      setSessionData(req, ['createProfile', id], {})
      config.apis.hmppsAudit.enabled = true
      auditSpy.mockReset()
      auditSpy.mockResolvedValue()
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

      expect(res.render).toHaveBeenCalledWith('pages/workReadiness/createProfile/typeOfWork/index', {
        ...mockData,
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - mode = new - Sets session record then redirects to jobOfParticularInterest', async () => {
      req.body.typeOfWork = TypeOfWorkValue.OTHER
      req.params.mode = 'new'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({
        typeOfWork: TypeOfWorkValue.OTHER,
      })
      expect(getSessionData(req, ['typeOfWork', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(
        addressLookup.workReadiness.createProfile.jobOfParticularInterest(id, 'new'),
      )
    })

    it('On success - mode = edit - Sets session record then redirects to checkAnswers', async () => {
      req.body.typeOfWork = TypeOfWorkValue.OTHER
      req.params.mode = 'edit'

      controller.post(req, res, next)

      expect(getSessionData(req, ['createProfile', id])).toEqual({
        typeOfWork: TypeOfWorkValue.OTHER,
      })
      expect(getSessionData(req, ['typeOfWork', id, 'data'])).toBeFalsy()
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workReadiness.createProfile.checkAnswers(id))
    })

    it('On success - mode = update - calls api and redirects to workProfile', async () => {
      req.context.profile = {
        profileData: {
          supportAccepted: {
            workInterests: {},
          },
        },
      }
      req.body.typeOfWork = [TypeOfWorkValue.OTHER]
      req.body.typeOfWorkDetails = 'Some details'
      req.params.mode = 'update'

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(mockService.updateProfile).toBeCalledTimes(1)
      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workProfile(id, workProfileTabs.EXPERIENCE))
    })

    it('On success - mode = update - audits profile update', async () => {
      req.context.profile = {
        profileData: {
          supportAccepted: {
            workInterests: {},
          },
        },
      }
      req.body.typeOfWork = [TypeOfWorkValue.OTHER]
      req.body.typeOfWorkDetails = 'Some details'
      req.params.mode = 'update'

      await controller.post(req, res, next)

      expect(auditSpy).toHaveBeenCalledTimes(1)
      expect(auditSpy.mock.lastCall.at(0)).toEqual({
        action: 'EDIT_WORK_PROFILE',
        who: res.locals.user.username,
        subjectType: 'PRISONER_ID',
        subjectId: 'A1234AA',
        service: 'hmpps-education-employment-ui',
      })
    })
  })
})
