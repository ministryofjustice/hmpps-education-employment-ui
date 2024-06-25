import joi from 'joi'
import type { ObjectSchema } from 'joi'

import AbilityToWorkValue from '../../../enums/abilityToWorkValue'

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
            AbilityToWorkValue.EDUCATION_ENROLLMENT,
            AbilityToWorkValue.FAMILY_ISSUES,
            AbilityToWorkValue.CARING_RESPONSIBILITIES,
            AbilityToWorkValue.MENTAL_HEALTH_ISSUES,
            AbilityToWorkValue.PHYSICAL_HEALTH_ISSUES,
            AbilityToWorkValue.DEPENDENCY_ISSUES,
            AbilityToWorkValue.NONE,
          ),
      )
      .messages({
        'any.only': msg,
        'any.required': msg,
      }),
  })
}
