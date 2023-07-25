import AlreadyInPlaceValue from '../../../enums/alreadyInPlaceValue'
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
      message: 'Select what mock_firstName mock_lastName has in place already',
      path: ['alreadyInPlace'],
      type: 'any.required',
      context: {
        key: 'alreadyInPlace',
        label: 'alreadyInPlace',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.alreadyInPlace = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'alreadyInPlace[0]',
        valids: [
          AlreadyInPlaceValue.BANK_ACCOUNT,
          AlreadyInPlaceValue.CV_AND_COVERING_LETTER,
          AlreadyInPlaceValue.DISCLOSURE_LETTER,
          AlreadyInPlaceValue.EMAIL,
          AlreadyInPlaceValue.PHONE,
          AlreadyInPlaceValue.HOUSING,
          AlreadyInPlaceValue.ID,
          AlreadyInPlaceValue.NONE,
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select what mock_firstName mock_lastName has in place already',
      path: ['alreadyInPlace', 0],
      type: 'any.only',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.alreadyInPlace = ['BANK_ACCOUNT']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
