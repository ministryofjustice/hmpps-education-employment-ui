import YesNoValue from '../../../enums/yesNoValue_'
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
      message: 'Select if mock_firstName mock_lastName has the right to work in the UK or not',
      path: ['rightToWork'],
      type: 'any.required',
      context: {
        key: 'rightToWork',
        label: 'rightToWork',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.rightToWork = 'RUBBISH'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      message: 'Select if mock_firstName mock_lastName has the right to work in the UK or not',
      path: ['rightToWork'],
      type: 'any.only',
      context: {
        key: 'rightToWork',
        label: 'rightToWork',
        valids: [YesNoValue.Yes, YesNoValue.No],
        value: 'RUBBISH',
      },
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.rightToWork = YesNoValue.Yes

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
