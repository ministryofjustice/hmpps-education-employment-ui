import whatNeedsToChangeValue from '../../../enums/whatNeedsToChangeValue'
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
      message: 'Select what change of circumstances would make mock_firstName mock_lastName want to get work',
      path: ['whatNeedsToChange'],
      type: 'any.required',
      context: {
        key: 'whatNeedsToChange',
        label: 'whatNeedsToChange',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.whatNeedsToChange = ['SOME_VALUE']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 0,
        label: 'whatNeedsToChange[0]',
        valids: [
          whatNeedsToChangeValue.HOUSING_IN_PLACE,
          whatNeedsToChangeValue.ID_IN_PLACE,
          whatNeedsToChangeValue.SUPPORT_TO_MANAGE_DEPENDENCY,
          whatNeedsToChangeValue.SUPPORT_TO_MANAGE_MENTAL_HEALTH,
          whatNeedsToChangeValue.OTHER,
        ],
        value: 'SOME_VALUE',
      },
      message: 'Select what change of circumstances would make mock_firstName mock_lastName want to get work',
      path: ['whatNeedsToChange', 0],
      type: 'any.only',
    })
  })

  it('On validation error - OTHER with no value - Returns the correct error message', () => {
    req.body.whatNeedsToChange = ['OTHER']

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'whatNeedsToChangeDetails',
        label: 'value',
        value: {
          whatNeedsToChange: ['OTHER'],
        },
      },
      message: 'Enter what change of circumstances would make mock_firstName mock_lastName want to get work',
      path: [],
      type: 'any.custom',
    })
  })

  it('On validation error - OTHER with value length > 200 - Returns the correct error message', () => {
    req.body.whatNeedsToChange = ['OTHER']
    req.body.whatNeedsToChangeDetails =
      'Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      context: {
        key: 'whatNeedsToChangeDetails',
        label: 'value',
        value: {
          whatNeedsToChangeDetails:
            'Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,Some value,',
          whatNeedsToChange: ['OTHER'],
        },
      },
      message: 'Reason must be 200 characters or less',
      path: [],
      type: 'any.length',
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.whatNeedsToChange = ['HOUSING_IN_PLACE']
    req.body.whatNeedsToChangeDetails = ''

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation success - OTHER with value - Returns no errors', () => {
    req.body.whatNeedsToChange = ['OTHER']
    req.body.whatNeedsToChangeDetails = 'Some value'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
