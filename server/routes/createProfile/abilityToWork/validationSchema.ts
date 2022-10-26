import joi from 'joi'
import type { ObjectSchema } from 'joi'

import abilityToWorkValue from '../../../enums/abilityToWorkValue'

interface AlreadyInPlaceData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: AlreadyInPlaceData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select what might affect ${firstName} ${lastName}'s ability to work`

  return joi.object({
    abilityToWork: joi
      .array()
      .required()
      .items(
        joi
          .any()
          .valid(
            abilityToWorkValue.EDUCATION_OR_TRAINING,
            abilityToWorkValue.FAMILY_ISSUES,
            abilityToWorkValue.CARING_RESPONSIBILITIES,
            abilityToWorkValue.MENTAL_HEALTH_CONDITION,
            abilityToWorkValue.PHYSICAL_HEALTH_CONDITION,
            abilityToWorkValue.DRUGS_OR_ALCOHOL,
            abilityToWorkValue.NONE,
          ),
      )
      .messages({
        'any.only': msg,
        'any.required': msg,
      }),
  })
}
