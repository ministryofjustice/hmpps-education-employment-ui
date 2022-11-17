import joi from 'joi'
import type { ObjectSchema } from 'joi'

import YesNoValue from '../../../enums/yesNoValue'

interface WorkExperienceData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: WorkExperienceData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select if ${firstName} ${lastName} has any work or volunteering experience or not`
  const msgOther = `Enter details of ${firstName} ${lastName}'s work or volunteering experience`

  return joi
    .object({
      workExperienceDetails: joi.string().allow(''),
      workExperience: joi.string().required().valid(YesNoValue.Yes, YesNoValue.No).messages({
        'any.only': msg,
        'any.required': msg,
      }),
    })
    .custom((obj, helper) => {
      const { workExperienceDetails, workExperience } = obj

      if (workExperience !== 'YES') {
        return true
      }

      if (!workExperienceDetails) {
        return helper.error('any.custom', {
          key: 'workExperienceDetails',
          label: 'workExperienceDetails',
        })
      }

      if (workExperienceDetails.length > 400) {
        return helper.error('any.length', {
          key: 'workExperienceDetails',
          label: 'workExperienceDetails',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Details must be 400 characters or less',
    })
}
