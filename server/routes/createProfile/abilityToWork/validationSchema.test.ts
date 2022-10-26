import abilityToWorkValue from '../../../enums/abilityToWorkValue'
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
      message: "Select what might affect mock_firstName mock_lastName's ability to work",
      path: ['abilityToWork'],
      type: 'any.required',
      context: {
        key: 'abilityToWork',
        label: 'abilityToWork',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.abilityToWork = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'abilityToWork[0]',
        valids: [
          abilityToWorkValue.EDUCATION_OR_TRAINING,
          abilityToWorkValue.FAMILY_ISSUES,
          abilityToWorkValue.CARING_RESPONSIBILITIES,
          abilityToWorkValue.MENTAL_HEALTH_CONDITION,
          abilityToWorkValue.PHYSICAL_HEALTH_CONDITION,
          abilityToWorkValue.DRUGS_OR_ALCOHOL,
          abilityToWorkValue.NONE,
        ],
        value: 'SOME_VALUE',
      },
      message: "Select what might affect mock_firstName mock_lastName's ability to work",
      path: ['abilityToWork', 0],
      type: 'any.only',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.abilityToWork = ['FAMILY_ISSUES']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
