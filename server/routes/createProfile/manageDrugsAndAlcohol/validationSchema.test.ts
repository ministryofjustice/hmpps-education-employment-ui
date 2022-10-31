import ManageDrugsAndAlcoholValue from '../../../enums/manageDrugsAndAlcoholValue'
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
      message: 'Select whether mock_firstName mock_lastName is able to manage their drug or alcohol dependency or not',
      path: ['manageDrugsAndAlcohol'],
      type: 'any.required',
      context: {
        key: 'manageDrugsAndAlcohol',
        label: 'manageDrugsAndAlcohol',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.manageDrugsAndAlcohol = 'RUBBISH'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      message: 'Select whether mock_firstName mock_lastName is able to manage their drug or alcohol dependency or not',
      path: ['manageDrugsAndAlcohol'],
      type: 'any.only',
      context: {
        key: 'manageDrugsAndAlcohol',
        label: 'manageDrugsAndAlcohol',
        valids: [ManageDrugsAndAlcoholValue.ABLE_TO_MANAGE, ManageDrugsAndAlcoholValue.NOT_ABLE_TO_MANAGE],
        value: 'RUBBISH',
      },
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.manageDrugsAndAlcohol = ManageDrugsAndAlcoholValue.ABLE_TO_MANAGE

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
