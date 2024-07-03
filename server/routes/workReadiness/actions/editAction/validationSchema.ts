import joi from 'joi'
import type { ObjectSchema } from 'joi'

interface EditActionData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(addAction: boolean, data: EditActionData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msgOther = `Enter the type of ID ${firstName} ${lastName} has`

  return addAction
    ? joi.object({
        noteText: joi.string().required().max(4000).messages({
          'any.required': 'Add or cancel your note before trying to save progress',
          'string.empty': 'Add or cancel your note before trying to save progress',
          'string.max': 'Note must be 4000 characters or less',
        }),
      })
    : joi
        .object({})
        .custom((obj, helper) => {
          const { other, identification } = obj

          if (!identification || !identification.includes('OTHER')) {
            return true
          }

          if (!other) {
            return helper.error('any.custom', {
              key: 'other',
              label: 'other',
            })
          }

          if (other.length > 200) {
            return helper.error('any.length', {
              key: 'other',
              label: 'other',
            })
          }

          return true
        })
        .messages({
          'any.custom': msgOther,
          'any.length': 'ID type must be 200 characters or less',
        })
}
