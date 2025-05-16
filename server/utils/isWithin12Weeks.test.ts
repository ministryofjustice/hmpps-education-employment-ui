import isWithin12Weeks from './isWithin12Weeks'

describe('isWithin12Weeks', () => {
  const today = new Date()
  const formatDate = (date: Date) => date.toISOString().split('T')[0]

  it("returns true for today's date (Date input)", () => {
    expect(isWithin12Weeks(today)).toBe(true)
  })

  it("returns true for today's date (string input)", () => {
    expect(isWithin12Weeks(formatDate(today))).toBe(true)
  })

  it('returns false for a date 10 weeks from today', () => {
    const tenWeeksAgo = new Date()
    tenWeeksAgo.setDate(today.getDate() + 10 * 7)
    expect(isWithin12Weeks(tenWeeksAgo)).toBe(true)
  })

  it('returns false for a date set to yesterday', () => {
    const thirteenWeeksAgo = new Date()
    thirteenWeeksAgo.setDate(today.getDate() - 1)
    expect(isWithin12Weeks(thirteenWeeksAgo)).toBe(false)
  })

  it('returns true for a date 10 days from today', () => {
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + 10)
    expect(isWithin12Weeks(futureDate)).toBe(true)
  })

  it('returns false for a date > 12 weeks from today', () => {
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + 13 * 7)
    expect(isWithin12Weeks(futureDate)).toBe(false)
  })

  it('throws an error for an invalid date string', () => {
    expect(isWithin12Weeks('not-a-date')).toBe(false)
  })
})
