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

  const longStr = 'x'.repeat(4001)

  it('On validation error - Required - Returns the correct error message', () => {
    const schema = validationSchema(true, mockData)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'noteText',
        label: 'noteText',
      },
      message: 'Add or cancel your note before trying to save progress',
      path: ['noteText'],
      type: 'any.required',
    })
  })

  it('On validation error - Empty - Returns the correct error message', () => {
    const schema = validationSchema(true, mockData)

    req.body.noteText = ''
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'noteText',
        label: 'noteText',
        value: '',
      },
      message: 'Add or cancel your note before trying to save progress',
      path: ['noteText'],
      type: 'string.empty',
    })
  })

  it('On validation error - Max length - Returns the correct error message', () => {
    const schema = validationSchema(true, mockData)

    req.body.noteText = longStr
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        encoding: undefined,
        key: 'noteText',
        label: 'noteText',
        limit: 4000,
        value: longStr,
      },
      message: 'Note must be 4000 characters or less',
      path: ['noteText'],
      type: 'string.max',
    })
  })

  it('On validation success - Returns no errors', () => {
    const schema = validationSchema(true, mockData)

    req.body = {}
    req.body.noteText = 'Some test data'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - OTHER - Required - Returns the correct error message', () => {
    const schema = validationSchema(false, mockData)

    req.body.noteText = ''
    req.body.identification = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'other',
        label: 'value',
        value: {
          identification: ['OTHER'],
          noteText: '',
        },
      },
      message: 'Enter the type of ID mock_firstName mock_lastName has',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER - Max length - Returns the correct error message', () => {
    const schema = validationSchema(false, mockData)

    req.body.noteText = ''
    req.body.identification = ['OTHER']
    req.body.other = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'other',
        label: 'value',
        value: {
          identification: ['OTHER'],
          noteText: '',
          other: longStr,
        },
      },
      message: 'ID type must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Not OTHER - Returns no errors', () => {
    req.body.noteText = ''
    req.body.identification = ['BIRTH_CERTIFICATE']
    req.body.other = ''

    const schema = validationSchema(false, mockData)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
