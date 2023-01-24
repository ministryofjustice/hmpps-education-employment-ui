import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const schema = validationSchema()

  const longStr = 'x'.repeat(4001)

  it('On validation error - Required - Returns the correct error message', () => {
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
    req.body.noteText = 'Some test data'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
