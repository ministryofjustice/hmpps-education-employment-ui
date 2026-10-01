import { Transform, Type } from 'class-transformer'
import { formatDateStringTodMMMMyyyy } from '../utils/index'
import TodoItemViewModel from './todoItemViewModel'

export default class ActionsRequiredViewModel {
  modifiedBy: string

  @Type(() => Date)
  @Transform(formatDateStringTodMMMMyyyy)
  modifiedDateTime: string

  @Type(() => TodoItemViewModel)
  actions: TodoItemViewModel[]
}
