import ProfileStatus from '../../../enums/profileStatus'
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
      message: "Select a new status for mock_firstName mock_lastName's work profile",
      path: ['newStatus'],
      type: 'any.required',
      context: {
        key: 'newStatus',
        label: 'newStatus',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.newStatus = 'RUBBISH'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      message: "Select a new status for mock_firstName mock_lastName's work profile",
      path: ['newStatus'],
      type: 'any.only',
      context: {
        key: 'newStatus',
        label: 'newStatus',
        valids: [
          ProfileStatus.NO_RIGHT_TO_WORK,
          ProfileStatus.READY_TO_WORK,
          ProfileStatus.SUPPORT_DECLINED,
          ProfileStatus.SUPPORT_NEEDED,
        ],
        value: 'RUBBISH',
      },
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.newStatus = ProfileStatus.READY_TO_WORK

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
