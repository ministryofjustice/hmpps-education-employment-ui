import joi from 'joi'
import type { ObjectSchema } from 'joi'

import applicationStatus from '../../../enums/applicationStatusValue'

interface ManageApplicationData {
  prisoner: { firstName: string; lastName: string }
}

export default function validationSchema(data: ManageApplicationData): ObjectSchema {
  const {
    prisoner: { firstName, lastName },
  } = data

  const msg = `Select an application progress for ${firstName} ${lastName}'s application`

  return joi.object({
    applicationStatus: joi
      .string()
      .empty('')
      .valid(
        applicationStatus.APPLICATION_MADE,
        applicationStatus.APPLICATION_UNSUCCESSFUL,
        applicationStatus.INTERVIEW_BOOKED,
        applicationStatus.JOB_OFFER,
        applicationStatus.SELECTED_FOR_INTERVIEW,
        applicationStatus.UNSUCCESSFUL_AT_INTERVIEW,
      )
      .required()
      .messages({
        'any.only': msg,
        'any.required': msg,
        'any.empty': msg,
      }),
    additionalInformation: joi
      .string()
      .allow('')
      .max(500)
      .message('Additional information must be 500 characters or less'),
  })
}
