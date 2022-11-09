import joi from 'joi'
import type { ObjectSchema } from 'joi'

import TrainingAndQualificationsValue from '../../../enums/trainingAndQualificationsValue'

interface TrainingAndQualificationsData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: TrainingAndQualificationsData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select if ${firstName} ${lastName} has any work or volunteering experience or not`
  const msgOther = `Enter details of ${firstName} ${lastName}'s work or volunteering experience`

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
      'any.length': 'Work experience details must be 4000 characters or less',
    })
}
