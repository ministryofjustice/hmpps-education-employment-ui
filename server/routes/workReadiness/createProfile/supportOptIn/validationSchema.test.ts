import YesNoValue from '../../../../enums/yesNoValue'
import expressMocks from '../../../../testutils/expressMocks'
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
      message: 'Select if mock_firstName mock_lastName wants support to get work or not',
      path: ['supportOptIn'],
      type: 'any.required',
      context: {
        key: 'supportOptIn',
        label: 'supportOptIn',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.supportOptIn = 'RUBBISH'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      message: 'Select if mock_firstName mock_lastName wants support to get work or not',
      path: ['supportOptIn'],
      type: 'any.only',
      context: {
        key: 'supportOptIn',
        label: 'supportOptIn',
        valids: [YesNoValue.YES, YesNoValue.NO],
        value: 'RUBBISH',
      },
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.supportOptIn = YesNoValue.YES

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
