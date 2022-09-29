import joi from 'joi'
import type { Request } from 'express'
import type { ObjectSchema } from 'joi'

interface RightToWorkData {
  prisoner: { firstName: string; lastName: string }
}

export default function (data: RightToWorkData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  return joi.object({
    rightToWork: joi
      .string()
      .required()
      .messages({
        'any.required': `Select if some ${firstName} ${lastName} has the right to work in the UK or not`,
      }),
  })
}
