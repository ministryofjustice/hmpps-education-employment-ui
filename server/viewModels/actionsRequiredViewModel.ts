import { Transform, Type } from 'class-transformer'
import { formatDateStringTodMMMyyyy } from '../utils/index'
import TodoItemViewModel from './todoItemViewModel'

export default class ActionsRequiredViewModel {
  modifiedBy: string

  @Type(() => Date)
  @Transform(formatDateStringTodMMMyyyy)
  modifiedDateTime: string

  @Type(() => TodoItemViewModel)
  actions: TodoItemViewModel[]
}
