import joi from 'joi'
import type { ObjectSchema } from 'joi'

import TrainingAndQualificationsValue from '../../../../enums/trainingAndQualificationsValue'

interface TrainingAndQualificationsData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: TrainingAndQualificationsData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select any qualifications or training ${firstName} ${lastName} has`
  const msgOther = `Enter details of the qualifications or training ${firstName} ${lastName} has done`

  return joi
    .object({
      trainingAndQualificationsDetails: joi.string().allow(''),
      trainingAndQualifications: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              TrainingAndQualificationsValue.ADVANCED_EDUCATION,
              TrainingAndQualificationsValue.CSCS,
              TrainingAndQualificationsValue.DRIVING_LICENSE,
              TrainingAndQualificationsValue.FIRST_AID,
              TrainingAndQualificationsValue.FOOD_HYGIENE,
              TrainingAndQualificationsValue.HEALTH_AND_SAFETY,
              TrainingAndQualificationsValue.HGV_LICENSE,
              TrainingAndQualificationsValue.HIGHER_EDUCATION,
              TrainingAndQualificationsValue.MACHINERY,
              TrainingAndQualificationsValue.MANUAL,
              TrainingAndQualificationsValue.TRADE,
              TrainingAndQualificationsValue.SCHOOL_EDUCATION,
              TrainingAndQualificationsValue.OTHER,
              TrainingAndQualificationsValue.NONE,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { trainingAndQualificationsDetails, trainingAndQualifications } = obj

      if (!trainingAndQualifications.includes('OTHER')) {
        return true
      }

      if (!trainingAndQualificationsDetails) {
        return helper.error('any.custom', {
          key: 'trainingAndQualificationsDetails',
          label: 'trainingAndQualificationsDetails',
        })
      }

      if (trainingAndQualificationsDetails.length > 4000) {
        return helper.error('any.length', {
          key: 'trainingAndQualificationsDetails',
          label: 'trainingAndQualificationsDetails',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Qualifications or training details must be 4000 characters or less',
    })
}
