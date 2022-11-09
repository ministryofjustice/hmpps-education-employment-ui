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
      message: 'Select if mock_firstName mock_lastName is interested in a particular job or not',
      path: ['jobOfParticularInterest'],
      type: 'any.required',
      context: {
        key: 'jobOfParticularInterest',
        label: 'jobOfParticularInterest',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.jobOfParticularInterest = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'jobOfParticularInterest',
        label: 'jobOfParticularInterest',
        valids: ['YES', 'NO'],
        value: 'SOME_VALUE',
      },
      message: 'Select if mock_firstName mock_lastName is interested in a particular job or not',
      path: ['jobOfParticularInterest'],
      type: 'any.only',
    })
  })

  it('On validation error - YES with no value - Returns the correct error message', () => {
    req.body.jobOfParticularInterest = 'YES'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'jobOfParticularInterestDetails',
        label: 'value',
        value: {
          jobOfParticularInterest: 'YES',
        },
      },
      message: 'Enter the particular job mock_firstName mock_lastName is interested in',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - YES with value length > 200 - Returns the correct error message', () => {
    req.body.jobOfParticularInterest = 'YES'
    req.body.jobOfParticularInterestDetails =
      'Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'jobOfParticularInterestDetails',
        label: 'value',
        value: {
          jobOfParticularInterestDetails:
            'Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,',
          jobOfParticularInterest: 'YES',
        },
      },
      message: 'Job details must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.jobOfParticularInterest = 'NO'
    req.body.jobOfParticularInterestDetails = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - YES with value - Returns no errors', () => {
    req.body.jobOfParticularInterest = 'YES'
    req.body.jobOfParticularInterestDetails = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
