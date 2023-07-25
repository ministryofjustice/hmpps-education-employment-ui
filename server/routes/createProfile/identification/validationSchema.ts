import joi from 'joi'
import type { ObjectSchema } from 'joi'

import IdentificationValue from '../../../enums/identificationValue'

interface IdentificationData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: IdentificationData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select what type of ID ${firstName} ${lastName} has`

  return joi.object({
    identification: joi
      .array()
      .required()
      .items(
        joi
          .any()
          .valid(
            IdentificationValue.BIRTH_CERTIFICATE,
            IdentificationValue.DRIVING_LICENCE,
            IdentificationValue.PASSPORT,
            IdentificationValue.OTHER,
          ),
      )
      .messages({
        'any.only': msg,
        'any.required': msg,
      }),
  })
}
