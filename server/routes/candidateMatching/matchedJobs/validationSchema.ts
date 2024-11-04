import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  const postCodeRegex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i

  return joi.object({
    locationFilter: joi.string().empty('').optional().regex(postCodeRegex).messages({
      'string.pattern.base': 'Release area postcode must be a valid postcode',
    }),
  })
}
