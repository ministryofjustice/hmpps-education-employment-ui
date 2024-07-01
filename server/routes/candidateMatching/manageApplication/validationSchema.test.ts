import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()

  const longStr = 'x'.repeat(501)
  const schema = validationSchema({ prisoner: { firstName: 'mock_firstname', lastName: 'mock_lastname' } })

  it('On validation success - should allow a additionalInformation with 500 characters', () => {
    req.body.applicationStatus = 'APPLICATION_MADE'
    req.body.additionalInformation = 'x'.repeat(500)

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a additionalInformation longer than 500 characters', () => {
    req.body.applicationStatus = 'APPLICATION_MADE'
    req.body.additionalInformation = longStr

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Additional information must be 500 characters or less')
  })
  it('On validation success - should allow a valid applicationStatus with additionalInformation being blank', () => {
    req.body.applicationStatus = 'APPLICATION_MADE'
    req.body.additionalInformation = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a applicationStatus being blank', () => {
    req.body.applicationStatus = ''
    req.body.additionalInformation = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe(
      "Select an application progress for mock_firstname mock_lastname's application",
    )
  })
})
