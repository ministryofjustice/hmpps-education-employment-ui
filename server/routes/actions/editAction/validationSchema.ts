import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  return joi.object({
    noteText: joi.string().required().max(4000).messages({
      'any.required': 'Add or cancel your note before trying to save progress',
      'string.empty': 'Add or cancel your note before trying to save progress',
      'string.max': 'Note must be 4000 characters or less',
    }),
  })
}
