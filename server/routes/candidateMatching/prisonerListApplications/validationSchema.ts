import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  return joi.object({
    prisonerNameFilter: joi.string().allow('').min(2).max(200).messages({
      'string.min': 'Name must be 2 characters or more',
      'string.max': 'Name must be 200 characters or less',
    }),
    jobFilter: joi.string().allow('').min(2).max(200).messages({
      'string.min': 'Job title or employer must be 2 characters or more',
      'string.max': 'Job title or employer must be 200 characters or less',
    }),
  })
}
