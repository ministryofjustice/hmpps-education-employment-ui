import joi from 'joi'

export default joi.object({
  rightToWork: joi.string().required().messages({
    'any.required': 'Please select a value',
  }),
})
