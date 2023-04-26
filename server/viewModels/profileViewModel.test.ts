import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import ProfileViewModel from './profileViewModel'

describe('ProfileViewModel', () => {
  const profileJson = {
    offenderId: 'ABC123',
    bookingId: 12345,
    createdBy: 'testuser',
    createdDateTime: '2022-04-18T09:20:00Z',
    modifiedBy: 'testuser2',
    modifiedByName: 'Test User 2',
    modifiedDateTime: '2022-04-19T12:35:00Z',
    schemaVersion: '1.0',
    profileData: {},
  }

  it('transforms JSON to ProfileViewModel instance', () => {
    const profileViewModel = plainToClass(ProfileViewModel, profileJson)

    expect(profileViewModel.offenderId).toBe(profileJson.offenderId)
    expect(profileViewModel.bookingId).toBe(profileJson.bookingId)
    expect(profileViewModel.createdBy).toBe(undefined)
    expect(profileViewModel.createdDateTime).toBe(undefined)
    expect(profileViewModel.modifiedBy).toBe(profileJson.modifiedBy)
    expect(profileViewModel.modifiedByName).toBe(profileJson.modifiedByName)
    expect(profileViewModel.modifiedDateTime).toBe('19 April')
    expect(profileViewModel.schemaVersion).toBe(undefined)
  })
})
