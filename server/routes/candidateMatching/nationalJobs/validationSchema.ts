import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  return joi.object({})
}
