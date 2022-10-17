import joi from 'joi'
import type { ObjectSchema } from 'joi'

import whatNeedsToChangeValue from '../../../enums/whatNeedsToChangeValue'

interface WhatNeedsToChangeData {
  prisoner: { firstName: string; lastName: string }
}

export default function (data: WhatNeedsToChangeData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select what change of circumstances would make ${firstName} ${lastName} want to get work`
  const msgOther = `Enter what change of circumstances would make ${firstName} ${lastName} want to get work`

  return joi
    .object({
      whatNeedsToChangeDetails: joi.string().allow(''),
      whatNeedsToChange: joi
        .array()
        .required()
        .items(
          joi
            .any()
            .valid(
              whatNeedsToChangeValue.HOUSING_IN_PLACE,
              whatNeedsToChangeValue.ID_IN_PLACE,
              whatNeedsToChangeValue.SUPPORT_TO_MANAGE_DEPENDENCY,
              whatNeedsToChangeValue.SUPPORT_TO_MANAGE_MENTAL_HEALTH,
              whatNeedsToChangeValue.OTHER,
            ),
        )
        .messages({
          'any.only': msg,
          'any.required': msg,
        }),
    })
    .custom((obj, helper) => {
      const { whatNeedsToChangeDetails, whatNeedsToChange } = obj

      if (!whatNeedsToChange.includes('OTHER')) {
        return true
      }

      if (!whatNeedsToChangeDetails) {
        return helper.error('any.custom', {
          key: 'whatNeedsToChangeDetails',
          label: 'whatNeedsToChangeDetails',
        })
      }

      if (whatNeedsToChangeDetails.length > 200) {
        return helper.error('any.length', {
          key: 'whatNeedsToChangeDetails',
          label: 'whatNeedsToChangeDetails',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Reason must be 200 characters or less',
    })
}
