import supportDeclinedReasonValue from '../../../enums/supportDeclinedReasonValue'
import YesNoValue from '../../../enums/yesNoValue'
import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const mockData = {
    prisoner: {
      firstName: 'mock_firstName',
      lastName: 'mock_lastName',
    },
  }

  const schema = validationSchema(mockData)

  it('On validation error - Required - Returns the correct error message', () => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      message: 'Select the reason why mock_firstName mock_lastName does not want support',
      path: ['supportDeclinedReason'],
      type: 'any.required',
      context: {
        key: 'supportDeclinedReason',
        label: 'supportDeclinedReason',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.supportDeclinedReason = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'supportDeclinedReason[0]',
        valids: [
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
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select the reason why mock_firstName mock_lastName does not want support',
      path: ['supportDeclinedReason', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.supportDeclinedReason = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'supportDeclinedDetails',
        label: 'value',
        value: {
          supportDeclinedReason: ['OTHER'],
        },
      },
      message: 'Enter the reason why mock_firstName mock_lastName does not want support',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.supportDeclinedReason = ['OTHER']
    req.body.supportDeclinedDetails =
      'Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'supportDeclinedDetails',
        label: 'value',
        value: {
          supportDeclinedDetails:
            'Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,',
          supportDeclinedReason: ['OTHER'],
        },
      },
      message: 'Reason must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.supportDeclinedReason = ['NO_REASON']
    req.body.supportDeclinedDetails = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.supportDeclinedReason = ['OTHER']
    req.body.supportDeclinedDetails = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})