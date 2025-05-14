export default function isWithin12Weeks(dateParam: string | Date): boolean {
  try {
    const dateToCheck = new Date(dateParam)
    if (Number.isNaN(dateToCheck.getTime())) return false // throw new Error('Invalid date input')

    const today = new Date()
    const twelveWeeksAgo = new Date()

    twelveWeeksAgo.setDate(today.getDate() - 12 * 7) // 12 weeks = 84 days

    return dateToCheck >= twelveWeeksAgo && dateToCheck <= today
  } catch {
    return false
  }
}
