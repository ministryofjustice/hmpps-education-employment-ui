import joi from 'joi'
import type { ObjectSchema } from 'joi'

import { ToDoStatus } from '../../../data/prisonerProfile/interfaces/todoItem'

interface NewStatusData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: NewStatusData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select a new status for ${firstName} ${lastName}'s work profile`

  return joi.object({
    toDoStatus: joi
      .string()
      .valid(ToDoStatus.IN_PROGRESS, ToDoStatus.NOT_STARTED, ToDoStatus.COMPLETED)
      .required()
      .messages({
        'any.only': msg,
        'any.required': msg,
      }),
  })
}
