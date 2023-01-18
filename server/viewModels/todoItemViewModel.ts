import { ToDoStatus } from '../data/prisonerProfile/interfaces/todoItem'
import AlreadyInPlaceValue from '../enums/alreadyInPlaceValue'

export default class TodoItemViewModel {
  todoItem: AlreadyInPlaceValue

  status: ToDoStatus
}
