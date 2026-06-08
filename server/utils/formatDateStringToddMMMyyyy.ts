import { format } from 'date-fns'
import { TransformFnParams } from 'class-transformer'

export default function formatDateStringToddMMMyyyy(params: TransformFnParams) {
  if (!params.value) return 'N/A'
  try {
    const date = new Date(params.value)

    return format(date, 'dd MMM yyyy')
  } catch {
    return 'N/A'
  }
}
