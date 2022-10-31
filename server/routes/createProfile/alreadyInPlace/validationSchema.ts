import joi from 'joi'
import type { ObjectSchema } from 'joi'

import AlreadyInPlaceValue from '../../../enums/alreadyInPlaceValue'

interface AlreadyInPlaceData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: AlreadyInPlaceData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select what ${firstName} ${lastName} has in place already`

  return joi.object({
    alreadyInPlace: joi
      .array()
      .required()
      .items(
        joi
          .any()
          .valid(
            AlreadyInPlaceValue.BANK_ACCOUNT,
            AlreadyInPlaceValue.CV_AND_COVERING_LETTER,
            AlreadyInPlaceValue.DISCLOSURE_LETTER,
            AlreadyInPlaceValue.EMAIL_OR_PHONE,
            AlreadyInPlaceValue.HOUSING,
            AlreadyInPlaceValue.ID,
            AlreadyInPlaceValue.NONE,
          ),
      )
      .messages({
        'any.only': msg,
        'any.required': msg,
      }),
  })
}
