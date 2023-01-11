import { ToDoStatus } from '../../../data/prisonerProfile/interfaces/todoItem'
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
      path: ['toDoStatus'],
      type: 'any.required',
      context: {
        key: 'toDoStatus',
        label: 'toDoStatus',
      },
    })
  })

  it('On validation error - Valid - Returns the correct error message', () => {
    req.body.toDoStatus = 'RUBBISH'

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error.details[0]).toEqual({
      message: "Select a new status for mock_firstName mock_lastName's work profile",
      path: ['toDoStatus'],
      type: 'any.only',
      context: {
        key: 'toDoStatus',
        label: 'toDoStatus',
        valids: [ToDoStatus.IN_PROGRESS, ToDoStatus.NOT_STARTED, ToDoStatus.COMPLETED],
        value: 'RUBBISH',
      },
    })
  })

  it('On validation success - Returns no errors', () => {
    req.body.toDoStatus = ToDoStatus.IN_PROGRESS

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })
})
