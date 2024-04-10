import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  return joi.object({
    locationFilter: joi.string().allow('').min(2).max(200).messages({
      'string.min': 'Name must be 2 characters or more',
      'string.max': 'Name must be 200 characters or less',
    }),
  })
}
