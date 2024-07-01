import joi from 'joi'
import type { ObjectSchema } from 'joi'

import IdentificationValue from '../../../../enums/identificationValue'

interface IdentificationData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: IdentificationData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select what type of ID ${firstName} ${lastName} has`
  const msgOther = `Enter the type of ID ${firstName} ${lastName} has`

  return joi
    .object({
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
    .custom((obj, helper) => {
      const { typeOfIdentificationDetails, identification } = obj

      if (!identification.includes(IdentificationValue.OTHER)) {
        return true
      }

      if (!typeOfIdentificationDetails) {
        return helper.error('any.custom', {
          key: 'typeOfIdentificationDetails',
          label: 'typeOfIdentificationDetails',
        })
      }

      if (typeOfIdentificationDetails.length > 200) {
        return helper.error('any.length', {
          key: 'typeOfIdentificationDetails',
          label: 'typeOfIdentificationDetails',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'ID type must be 200 characters or less',
    })
}
