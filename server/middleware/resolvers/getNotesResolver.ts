/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
import type { RequestHandler } from 'express'
import Note from '../../data/prisonerProfile/interfaces/note'

import { UserService } from '../../services'
import PrisonerProfileService from '../../services/prisonerProfileService'
import { getUserFullName } from './utils'

interface NoteWithName extends Note {
  createdName?: string
}

// Gets profile based on id parameter and puts it into request context
const getNotesResolver =
  (prisonerProfileService: PrisonerProfileService, userService: UserService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id, action } = req.params
    const { user } = res.locals

    try {
      const notes: Array<NoteWithName> = await prisonerProfileService.getNotes(user.token, id, action)

      for (let i = 0; i < notes.length; i += 1) {
        notes[i].createdName = await getUserFullName(req, res, userService, notes[i].createdBy)
      }

      req.context.notes = notes

      next()
    } catch (err) {
      next(err)
    }
  }

export default getNotesResolver
