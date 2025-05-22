export default function isWithin12Weeks(dte: string | Date): boolean {
  try {
    if (!dte) return false // throw new Error('Invalid date input')

    const formatDate = (date: Date) => date.toISOString().split('T')[0]
    const dateToCheck = formatDate(new Date(dte))

    const today = new Date()
    const twelveWeeks = new Date()

    twelveWeeks.setDate(today.getDate() + 12 * 7) // 12 weeks = 84 days
    const twelveWeeksFromNow = formatDate(twelveWeeks)

    return dateToCheck <= twelveWeeksFromNow && dateToCheck >= formatDate(today)
  } catch {
    return false
  }
}
