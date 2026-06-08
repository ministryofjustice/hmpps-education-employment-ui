import { format } from 'date-fns'
import { TransformFnParams } from 'class-transformer'

export default function formatDateStringTodMMMyyyy(params: TransformFnParams) {
  if (!params.value) return 'N/A'
  try {
    const date = new Date(params.value)

    return format(date, 'd MMM yyyy')
  } catch {
    return 'N/A'
  }
}
