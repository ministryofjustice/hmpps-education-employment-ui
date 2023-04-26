import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import ActionsRequiredViewModel from './actionsRequiredViewModel'
import TodoItemViewModel from './todoItemViewModel'

describe('ActionsRequiredViewModel', () => {
  const actionsRequiredJson = {
    modifiedBy: 'John Doe',
    modifiedDateTime: '2022-05-01T12:00:00Z',
    actions: [
      { id: 1, description: 'Action 1', isCompleted: false },
      { id: 2, description: 'Action 2', isCompleted: true },
    ],
  }

  it('transforms JSON to ActionsRequiredViewModel instance', () => {
    const actionsRequiredViewModel = plainToClass(ActionsRequiredViewModel, actionsRequiredJson)

    // Non-transformed properties
    expect(actionsRequiredViewModel.modifiedBy).toBe(actionsRequiredJson.modifiedBy)

    // Transformed properties
    expect(actionsRequiredViewModel.modifiedDateTime).toBe('01 May 2022')
    expect(actionsRequiredViewModel.actions.length).toBe(2)
    expect(actionsRequiredViewModel.actions[0] instanceof TodoItemViewModel).toBe(true)
    expect(actionsRequiredViewModel.actions[1] instanceof TodoItemViewModel).toBe(true)
  })
})
