import joi from 'joi'
import type { ObjectSchema } from 'joi'

import WhatNeedsToChangeValue from '../../../../enums/whatNeedsToChangeValue'

interface WhatNeedsToChangeData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: WhatNeedsToChangeData): ObjectSchema {
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
              WhatNeedsToChangeValue.HOUSING_ON_RELEASE,
              WhatNeedsToChangeValue.ID_ON_RELEASE,
              WhatNeedsToChangeValue.DEPENDENCY_SUPPORT,
              WhatNeedsToChangeValue.MENTAL_HEALTH_SUPPORT,
              WhatNeedsToChangeValue.OTHER,
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
