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
      message: 'Select if mock_firstName mock_lastName has any work or volunteering experience or not',
      path: ['workExperience'],
      type: 'any.required',
      context: {
        key: 'workExperience',
        label: 'workExperience',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.workExperience = 'SOME_VALUE'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'workExperience',
        label: 'workExperience',
        valids: ['YES', 'NO'],
        value: 'SOME_VALUE',
      },
      message: 'Select if mock_firstName mock_lastName has any work or volunteering experience or not',
      path: ['workExperience'],
      type: 'any.only',
    })
  })

  it('On validation error - YES with no value - Returns the correct error message', () => {
    req.body.workExperience = 'YES'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'workExperienceDetails',
        label: 'value',
        value: {
          workExperience: 'YES',
        },
      },
      message: "Enter details of mock_firstName mock_lastName's work or volunteering experience",
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - YES with value length > 400 - Returns the correct error message', () => {
    req.body.workExperience = 'YES'
    req.body.workExperienceDetails =
      'Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value, Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'workExperienceDetails',
        label: 'value',
        value: {
          workExperienceDetails:
            'Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value, Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,',
          workExperience: 'YES',
        },
      },
      message: 'Details must be 400 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.workExperience = 'NO'
    req.body.workExperienceDetails = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - YES with value - Returns no errors', () => {
    req.body.workExperience = 'YES'
    req.body.workExperienceDetails = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
