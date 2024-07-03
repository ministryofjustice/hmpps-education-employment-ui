import { Transform, Type } from 'class-transformer'
import { formatDateStringToddMMMyyyy } from '../utils/index'
import TodoItemViewModel from './todoItemViewModel'

export default class ActionsRequiredViewModel {
  modifiedBy: string

  @Type(() => Date)
  @Transform(formatDateStringToddMMMyyyy)
  modifiedDateTime: string

  @Type(() => TodoItemViewModel)
  actions: TodoItemViewModel[]
}
