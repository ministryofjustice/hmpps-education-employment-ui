import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const longStr = 'x'.repeat(201)
  const schema = validationSchema()

  it('On validation success - should allow a prisonerNameFilter with 200 characters', () => {
    req.body.prisonerNameFilter = 'x'.repeat(200)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a prisonerNameFilter longer than 200 characters', () => {
    req.body.prisonerNameFilter = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Name must be 200 characters or less')
  })
  it('On validation success - should allow a prisonerNameFilter with 200 characters', () => {
    req.body.prisonerNameFilter = 'xx'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a jobFilter shorter than 2 characters', () => {
    req.body.prisonerNameFilter = ''
    req.body.jobFilter = 'x'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Job title or employer must be 2 characters or more')
  })

  it('On validation success - should allow a jobFilter with 200 characters', () => {
    req.body.prisonerNameFilter = ''
    req.body.jobFilter = 'x'.repeat(200)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a jobFilter longer than 200 characters', () => {
    req.body.prisonerNameFilter = ''
    req.body.jobFilter = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Job title or employer must be 200 characters or less')
  })
  it('On validation success - should allow a jobFilter with 200 characters', () => {
    req.body.prisonerNameFilter = ''
    req.body.jobFilter = 'xx'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a jobFilter shorter than 2 characters', () => {
    req.body.prisonerNameFilter = ''
    req.body.jobFilter = 'x'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Job title or employer must be 2 characters or more')
  })
})
