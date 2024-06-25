import joi from 'joi'
import type { ObjectSchema } from 'joi'

import TypeOfWorkValue from '../../../../enums/typeOfWorkValue'

interface TypeOfWorkData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: TypeOfWorkData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select the type of work ${firstName} ${lastName} is interested in`
  const msgOther = `Enter the type of work ${firstName} ${lastName} is interested in`

  return joi
    .object({
      typeOfWorkDetails: joi.string().allow(''),
      typeOfWork: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              TypeOfWorkValue.OUTDOOR,
              TypeOfWorkValue.CONSTRUCTION,
              TypeOfWorkValue.DRIVING,
              TypeOfWorkValue.BEAUTY,
              TypeOfWorkValue.HOSPITALITY,
              TypeOfWorkValue.TECHNICAL,
              TypeOfWorkValue.MANUFACTURING,
              TypeOfWorkValue.OFFICE,
              TypeOfWorkValue.RETAIL,
              TypeOfWorkValue.SPORTS,
              TypeOfWorkValue.WAREHOUSING,
              TypeOfWorkValue.WASTE_MANAGEMENT,
              TypeOfWorkValue.EDUCATION_TRAINING,
              TypeOfWorkValue.CLEANING_AND_MAINTENANCE,
              TypeOfWorkValue.OTHER,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { typeOfWorkDetails, typeOfWork } = obj

      if (!typeOfWork.includes('OTHER')) {
        return true
      }

      if (!typeOfWorkDetails) {
        return helper.error('any.custom', {
          key: 'typeOfWorkDetails',
          label: 'typeOfWorkDetails',
        })
      }

      if (typeOfWorkDetails.length > 200) {
        return helper.error('any.length', {
          key: 'typeOfWorkDetails',
          label: 'typeOfWorkDetails',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Details must be 200 characters or less',
    })
}
