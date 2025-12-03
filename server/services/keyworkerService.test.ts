/* eslint-disable @typescript-eslint/no-explicit-any */
import KeyworkerApiClient from '../data/keyworkerApi/keyworkerApiClient'
import KeyworkerService from './keyworkerService'
import HmppsAuthClient from '../data/hmppsAuthClient'

jest.mock('../data/keyworkerApi/keyworkerApiClient')
jest.mock('../data/hmppsAuthClient')

describe('KeyworkerService', () => {
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let keyworkerApiClientMock: jest.Mocked<KeyworkerApiClient>
  let keyworkerService: KeyworkerService

  beforeEach(() => {
    hmppsAuthClientMock = {
      getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
    } as unknown as jest.Mocked<HmppsAuthClient>
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

    keyworkerService = new KeyworkerService(hmppsAuthClientMock)
  })

  it('should return the keyworker details for the given offender', async () => {
    keyworkerApiClientMock = {
      getStaffAllocationsForOffender: jest.fn().mockResolvedValue({
        allocations: [
          {
            policy: {
              code: 'KEY_WORKER',
              description: 'Key worker',
            },
            staffMember: {
              staffId: 123,
              firstName: 'TEST1',
              lastName: 'USER1',
              emailAddresses: ['test1.user1@nomis.com', 'test2.user2@nomis.com'],
            },
          },
        ],
      }),
    } as unknown as jest.Mocked<KeyworkerApiClient>
    ;(KeyworkerApiClient as any).mockImplementation(() => keyworkerApiClientMock)

    const result = await keyworkerService.getKeyworkerForOffender('user', 'offender')

    expect(result).toEqual({
      firstName: 'Test1', // Should format the first and last names to title case
      lastName: 'User1',
      email: 'test1.user1@nomis.com', // Should pull out the first email address in the list
      success: true,
    })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(keyworkerApiClientMock.getStaffAllocationsForOffender).toHaveBeenCalledWith('offender')
  })

  it('should return the keyworker details for the given offender, where there is no email address', async () => {
    keyworkerApiClientMock = {
      getStaffAllocationsForOffender: jest.fn().mockResolvedValue({
        allocations: [
          {
            policy: {
              code: 'KEY_WORKER',
              description: 'Key worker',
            },
            staffMember: {
              staffId: 123,
              firstName: 'TEST1',
              lastName: 'USER1',
              emailAddresses: [],
            },
          },
        ],
      }),
    } as unknown as jest.Mocked<KeyworkerApiClient>
    ;(KeyworkerApiClient as any).mockImplementation(() => keyworkerApiClientMock)

    const result = await keyworkerService.getKeyworkerForOffender('user', 'offender')

    expect(result).toEqual({
      firstName: 'Test1',
      lastName: 'User1',
      email: undefined, // Should return 'undefined' if there are no email addresses
      success: true,
    })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(keyworkerApiClientMock.getStaffAllocationsForOffender).toHaveBeenCalledWith('offender')
  })

  it('should return no keyworker details for the given offender, where there is no first name', async () => {
    keyworkerApiClientMock = {
      getStaffAllocationsForOffender: jest.fn().mockResolvedValue({
        allocations: [
          {
            policy: {
              code: 'KEY_WORKER',
              description: 'Key worker',
            },
            staffMember: {
              staffId: 123,
              firstName: null,
              lastName: 'USER1',
              emailAddresses: ['test1.user1@nomis.com'],
            },
          },
        ],
      }),
    } as unknown as jest.Mocked<KeyworkerApiClient>
    ;(KeyworkerApiClient as any).mockImplementation(() => keyworkerApiClientMock)

    const result = await keyworkerService.getKeyworkerForOffender('user', 'offender')

    expect(result).toEqual(undefined) // Returns 'undefined' if there is no first name

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(keyworkerApiClientMock.getStaffAllocationsForOffender).toHaveBeenCalledWith('offender')
  })

  it('should return no keyworker details for the given offender, where there is no last name', async () => {
    keyworkerApiClientMock = {
      getStaffAllocationsForOffender: jest.fn().mockResolvedValue({
        allocations: [
          {
            policy: {
              code: 'KEY_WORKER',
              description: 'Key worker',
            },
            staffMember: {
              staffId: 123,
              firstName: 'TEST1',
              lastName: null,
              emailAddresses: ['test1.user1@nomis.com'],
            },
          },
        ],
      }),
    } as unknown as jest.Mocked<KeyworkerApiClient>
    ;(KeyworkerApiClient as any).mockImplementation(() => keyworkerApiClientMock)

    const result = await keyworkerService.getKeyworkerForOffender('user', 'offender')

    expect(result).toEqual(undefined) // Returns 'undefined' if there is no last name

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(keyworkerApiClientMock.getStaffAllocationsForOffender).toHaveBeenCalledWith('offender')
  })

  it('should return no keyworker details for the given offender, where there is no key worker allocation', async () => {
    keyworkerApiClientMock = {
      getStaffAllocationsForOffender: jest.fn().mockResolvedValue({
        allocations: [
          {
            policy: {
              code: 'NOT_A_KEY_WORKER',
              description: 'Not a key worker',
            },
            staffMember: {
              staffId: 123,
              firstName: 'TEST1',
              lastName: 'USER1',
              emailAddresses: ['test1.user1@nomis.com'],
            },
          },
        ],
      }),
    } as unknown as jest.Mocked<KeyworkerApiClient>
    ;(KeyworkerApiClient as any).mockImplementation(() => keyworkerApiClientMock)

    const result = await keyworkerService.getKeyworkerForOffender('user', 'offender')

    expect(result).toEqual(undefined) // Returns 'undefined' if there is no allocation with policy.code = 'KEY_WORKER'

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(keyworkerApiClientMock.getStaffAllocationsForOffender).toHaveBeenCalledWith('offender')
  })

  it('should return response with successful false when an error when the keyworker API call fails with 500', async () => {
    const apiError = {
      status: 500,
      message: 'Keyworker API failure',
    }

    keyworkerApiClientMock = {
      getStaffAllocationsForOffender: jest.fn().mockRejectedValue(apiError),
    } as unknown as jest.Mocked<KeyworkerApiClient>
    ;(KeyworkerApiClient as any).mockImplementation(() => keyworkerApiClientMock)

    const result = await keyworkerService.getKeyworkerForOffender('user', 'offender')

    expect(result).toEqual({ success: false })
    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(keyworkerApiClientMock.getStaffAllocationsForOffender).toHaveBeenCalledWith('offender')
  })
})
