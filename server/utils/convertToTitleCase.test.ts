import convertToTitleCase from './convertToTitleCase'

describe('Convert to title case', () => {
  it('null string', () => {
    expect(convertToTitleCase(null)).toEqual('')
  })
  it('empty string', () => {
    expect(convertToTitleCase('')).toEqual('')
  })
  it('Lower Case', () => {
    expect(convertToTitleCase('user1')).toEqual('User1')
  })
  it('Upper Case', () => {
    expect(convertToTitleCase('USER1')).toEqual('User1')
  })
  it('Mixed Case', () => {
    expect(convertToTitleCase('UsER1')).toEqual('User1')
  })
  it('Multiple words', () => {
    expect(convertToTitleCase('TesT USer1')).toEqual('Test User1')
  })
  it('Leading spaces', () => {
    expect(convertToTitleCase('  UseR1')).toEqual('  User1')
  })
  it('Trailing spaces', () => {
    expect(convertToTitleCase('USer1  ')).toEqual('User1  ')
  })
  it('Hyphenated', () => {
    expect(convertToTitleCase('Test-User AnoTHER-tEsT-USER1')).toEqual('Test-User Another-Test-User1')
  })
})
