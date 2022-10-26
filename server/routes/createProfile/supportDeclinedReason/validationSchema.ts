import joi from 'joi'
import type { ObjectSchema } from 'joi'

import supportDeclinedReasonValue from '../../../enums/supportDeclinedReasonValue'

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
              supportDeclinedReasonValue.LIMIT_THEIR_ABILITY,
              supportDeclinedReasonValue.CARING_RESPONSIBILITIES,
              supportDeclinedReasonValue.LACKS_CONFIDENCE,
              supportDeclinedReasonValue.LACKS_MOTIVATION,
              supportDeclinedReasonValue.HEALTH_CONDITION,
              supportDeclinedReasonValue.NO_REASON,
              supportDeclinedReasonValue.RETIRED,
              supportDeclinedReasonValue.RETURNING_TO_WORK,
              supportDeclinedReasonValue.SELF_EMPLOYED,
              supportDeclinedReasonValue.OTHER,
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
