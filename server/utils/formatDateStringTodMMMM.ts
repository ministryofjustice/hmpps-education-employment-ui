import { format } from 'date-fns'
import { TransformFnParams } from 'class-transformer'

export default function formatDateStringTodMMMM(params: TransformFnParams) {
  if (!params.value) return 'N/A'
  try {
    const date = new Date(params.value)

    return format(date, 'd MMMM')
  } catch {
    return 'N/A'
  }
}
