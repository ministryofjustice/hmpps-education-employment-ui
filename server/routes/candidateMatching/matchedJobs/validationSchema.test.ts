import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const longStr = 'x'.repeat(201)
  const schema = validationSchema()

  it('On validation success - should allow a locationFilter with 200 characters', () => {
    req.body.locationFilter = 'x'.repeat(200)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a locationFilter longer than 200 characters', () => {
    req.body.locationFilter = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Name must be 200 characters or less')
  })
  it('On validation success - should allow a locationFilter with 200 characters', () => {
    req.body.locationFilter = 'xx'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a locationFilter shorter than 2 characters', () => {
    req.body.locationFilter = 'x'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Name must be 2 characters or more')
  })
})
