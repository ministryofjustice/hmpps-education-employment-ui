import joi from 'joi'
import type { ObjectSchema } from 'joi'

import YesNoValue from '../../../../enums/yesNoValue'

interface JobOfParticularInterestData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: JobOfParticularInterestData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select if ${firstName} ${lastName} is interested in a particular job or not`
  const msgOther = `Enter the particular job ${firstName} ${lastName} is interested in`

  return joi
    .object({
      jobOfParticularInterestDetails: joi.string().allow(''),
      jobOfParticularInterest: joi.string().required().valid(YesNoValue.YES, YesNoValue.NO).messages({
        'any.only': msg,
        'any.required': msg,
      }),
    })
    .custom((obj, helper) => {
      const { jobOfParticularInterestDetails, jobOfParticularInterest } = obj

      if (jobOfParticularInterest !== 'YES') {
        return true
      }

      if (!jobOfParticularInterestDetails) {
        return helper.error('any.custom', {
          key: 'jobOfParticularInterestDetails',
          label: 'jobOfParticularInterestDetails',
        })
      }

      if (jobOfParticularInterestDetails.length > 200) {
        return helper.error('any.length', {
          key: 'jobOfParticularInterestDetails',
          label: 'jobOfParticularInterestDetails',
        })
      }

      return true
    })
    .messages({
      'any.custom': msgOther,
      'any.length': 'Job details must be 200 characters or less',
    })
}
