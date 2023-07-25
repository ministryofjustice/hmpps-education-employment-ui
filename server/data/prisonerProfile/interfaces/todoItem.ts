import AlreadyInPlaceValue from '../../../enums/alreadyInPlaceValue'
import IdentificationValue from '../../../enums/identificationValue'

export enum ToDoStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export default interface TodoItem {
  todoItem: AlreadyInPlaceValue
  status: ToDoStatus
  id?: IdentificationValue[]
  other?: string
}
