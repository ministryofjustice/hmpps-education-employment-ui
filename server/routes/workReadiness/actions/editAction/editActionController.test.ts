/* eslint-disable @typescript-eslint/no-explicit-any */

import { plainToClass } from 'class-transformer'
import expressMocks from '../../../../testutils/expressMocks'
import Controller from './editActionController'
import addressLookup from '../../../addressLookup'
import { setSessionData } from '../../../../utils/session'
import ProfileStatus from '../../../../enums/profileStatus'
import validateFormSchema from '../../../../utils/validateFormSchema'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import NotesViewModel from '../../../../viewModels/notesViewModel'
import pageTitleLookup from '../../../../utils/pageTitleLookup'

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

describe('EditActionController', () => {
  const { req, res, next } = expressMocks()

  const pageTitleLookupMock = pageTitleLookup as jest.Mock
  pageTitleLookupMock.mockReturnValue('mock_page_title')

  req.context.prisoner = {
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
  }

  req.context.notes = [
    {
      createdDate: '23 Oct 2022',
      createdTime: '10:34',
      createdName: 'Joe Bloggs',
      details: 'Some note details',
    },
  ]

  req.context.profile = {
    profileData: {
      status: ProfileStatus.NO_RIGHT_TO_WORK,
      supportAccepted: {
        actionsRequired: {
          actions: [
            {
              todoItem: 'CV_AND_COVERING_LETTER',
              status: 'IN_PROGRESS',
            },
          ],
        },
      },
    },
  }

  req.params.id = 'mock_ref'
  req.params.action = 'cv_and_covering_letter'
  req.originalUrl = 'mock_url'
  res.locals.user = {}
  const { id, action } = req.params

  const mockData = {
    backLocation: addressLookup.workProfile(id),
    backLocationAriaText: 'Back to mock_page_title',
    prisoner: plainToClass(PrisonerViewModel, req.context.prisoner),
    toDoItem: 'CV_AND_COVERING_LETTER',
    toDoStatus: 'IN_PROGRESS',
    id: 'mock_ref',
    identification: [] as Array<string>,
    noteAction: 'view',
    notes: plainToClass(NotesViewModel, req.context.notes),
  }

  const mockService: any = {
    updateProfile: jest.fn(),
    createNote: jest.fn(),
  }

  const controller = new Controller(mockService)

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['editAction', id, 'data'], mockData)
      setSessionData(req, ['actions', id], {})
      req.params.action = 'cv_and_covering_letter'
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('On success - Record found - Calls render with the correct data', async () => {
      controller.get(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/workReadiness/actions/editAction/index', mockData)
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On success - No record found - Redirects to profile', async () => {
      req.params.action = 'id'
      controller.get(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workProfile(id))
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
      setSessionData(req, ['editAction', id, 'data'], mockData)
      setSessionData(req, ['actions', id], {})
      mockService.updateProfile.mockResolvedValue({})
      req.params.action = 'cv_and_covering_letter'
      req.body = {}
    })

    it('On error - Calls next with error', async () => {
      req.query.noteAction = 'add'
      req.body.saveNote = ''
      validationMock.mockImplementation(() => {
        throw new Error('mock_error')
      })

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })

    it('On validation error - Calls render with the correct data', async () => {
      req.query.noteAction = 'add'
      req.body.saveNote = ''
      validationMock.mockImplementation(() => errors)

      await controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/workReadiness/actions/editAction/index', {
        ...mockData,
        saveNote: '',
        errors,
      })
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On Success - Add note - Redirects in correct mode', async () => {
      req.query.noteAction = 'view'
      req.body.addNote = ''

      await controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        `${addressLookup.actions.editAction(id, action)}?noteAction=add#noteText`,
      )
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On Success - Save note - Calls add note API and refreshes page', async () => {
      req.query.noteAction = 'add'
      req.body.saveNote = ''

      await controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.actions.editAction(id, action))
      expect(next).toHaveBeenCalledTimes(0)
    })

    it('On Success - Submit - Calls API and redirects to profile', async () => {
      req.query.noteAction = 'view'

      await controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(addressLookup.workProfile(id))
      expect(next).toHaveBeenCalledTimes(0)
    })
  })
})
