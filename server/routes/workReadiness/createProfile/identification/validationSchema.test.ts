import IdentificationValue from '../../../../enums/identificationValue'
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

  const longStr = 'x'.repeat(201)

  const schema = validationSchema(mockData)

  it('On validation error - Required - Returns the correct error message', () => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      message: 'Select what type of ID mock_firstName mock_lastName has',
      path: ['identification'],
      type: 'any.required',
      context: {
        key: 'identification',
        label: 'identification',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.identification = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'identification[0]',
        valids: [
          IdentificationValue.BIRTH_CERTIFICATE,
          IdentificationValue.DRIVING_LICENCE,
          IdentificationValue.PASSPORT,
          IdentificationValue.OTHER,
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select what type of ID mock_firstName mock_lastName has',
      path: ['identification', 0],
      type: 'any.only',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.identification = ['BIRTH_CERTIFICATE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - OTHER - Max length - Returns the correct error message', () => {
    req.body.identification = ['OTHER']
    req.body.typeOfIdentificationDetails = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'typeOfIdentificationDetails',
        label: 'value',
        value: {
          identification: ['OTHER'],
          typeOfIdentificationDetails: longStr,
        },
      },
      message: 'ID type must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - OTHER valid - Returns no errors', () => {
    req.body.identification = ['OTHER']
    req.body.typeOfIdentificationDetails = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
