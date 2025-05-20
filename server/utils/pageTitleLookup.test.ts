/* eslint-disable @typescript-eslint/no-explicit-any */
import pageTitleLookup from './pageTitleLookup'

describe('#pageTitleLookup', () => {
  it('returns the correct page title for view url', () => {
    const prisoner = {
      firstName: 'User1',
      lastName: 'tester1',
    }
    const url = 'view'
    const expectedTitle = "User1 Tester1's work profile"
    const pageTitle = pageTitleLookup(prisoner as any, url)
    expect(pageTitle).toEqual(expectedTitle)
  })

  it('returns the correct page title for check-answers url', () => {
    const prisoner = {
      firstName: 'user2',
      lastName: 'tester2',
    }
    const url = 'check-answers'
    const expectedTitle = "Check your answers before saving them to User2 Tester2's profile"
    const pageTitle = pageTitleLookup(prisoner as any, url)
    expect(pageTitle).toEqual(expectedTitle)
  })

  it('returns an empty string for an invalid url', () => {
    const prisoner = {
      firstName: 'user3',
      lastName: 'tester3',
    }
    const url = 'invalid-url'
    const pageTitle = pageTitleLookup(prisoner as any, url)
    expect(pageTitle).toEqual(undefined)
  })
})
