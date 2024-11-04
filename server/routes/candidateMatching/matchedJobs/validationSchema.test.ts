import expressMocks from '../../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()
  const schema = validationSchema()

  it('On validation success - should allow a locationFilter with a valid postcode', () => {
    req.body.locationFilter = 'NE236DR'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow a locationFilter to not be an invalid postcode', () => {
    req.body.locationFilter = 'x'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Release area postcode must be a valid postcode')
  })
})
