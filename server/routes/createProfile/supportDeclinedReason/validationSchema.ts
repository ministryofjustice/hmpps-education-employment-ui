import joi from 'joi'
import type { ObjectSchema } from 'joi'

import SupportDeclinedReasonValue from '../../../enums/supportDeclinedReasonValue'

interface SupportDeclinedReasonData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: SupportDeclinedReasonData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select the reason why ${firstName} ${lastName} does not want support`
  const msgOther = `Enter the reason why ${firstName} ${lastName} does not want support`

  return joi
    .object({
      supportDeclinedDetails: joi.string().allow(''),
      supportDeclinedReason: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              SupportDeclinedReasonValue.LIMIT_THEIR_ABILITY,
              SupportDeclinedReasonValue.FULL_TIME_CARER,
              SupportDeclinedReasonValue.LACKS_CONFIDENCE,
              SupportDeclinedReasonValue.LACKS_MOTIVATION,
              SupportDeclinedReasonValue.HEALTH,
              SupportDeclinedReasonValue.NO_REASON,
              SupportDeclinedReasonValue.RETIRED,
              SupportDeclinedReasonValue.RETURNING_TO_JOB,
              SupportDeclinedReasonValue.SELF_EMPLOYED,
              SupportDeclinedReasonValue.OTHER,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { supportDeclinedDetails, supportDeclinedReason } = obj

      if (!supportDeclinedReason.includes('OTHER')) {
        return true
      }

      if (!supportDeclinedDetails) {
        return helper.error('any.custom', {
          key: 'supportDeclinedDetails',
          label: 'supportDeclinedDetails',
        })
      }

      if (supportDeclinedDetails.length > 200) {
        return helper.error('any.length', {
          key: 'supportDeclinedDetails',
          label: 'supportDeclinedDetails',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Reason must be 200 characters or less',
    })
}
