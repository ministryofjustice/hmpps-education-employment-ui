/* eslint-disable @typescript-eslint/no-explicit-any */
import UserService from './userService'
import HmppsAuthClient from '../data/hmppsAuthClient'
import ManageUsersApiClient, { User } from '../data/manageUsersApi/manageUsersApiClient'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/manageUsersApi/manageUsersApiClient')
jest.mock('../data/nomisUserRolesApi/nomisUserRolesApiClient')

const token = 'some token'

describe('User service', () => {
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let manageUsersApiClientMock: jest.Mocked<ManageUsersApiClient>
  let userService: UserService
  let nomisUserRolesApiClientMock: jest.Mocked<NomisUserRolesApiClient>

  describe('getUser', () => {
    beforeEach(() => {
      hmppsAuthClientMock = {
        getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
      } as unknown as jest.Mocked<HmppsAuthClient>
      ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

      manageUsersApiClientMock = {
        getUser: jest.fn(),
      } as unknown as jest.Mocked<ManageUsersApiClient>
      ;(ManageUsersApiClient as any).mockImplementation(() => manageUsersApiClientMock)

      userService = new UserService(hmppsAuthClientMock)
    })
    it('Retrieves and formats user name', async () => {
      manageUsersApiClientMock.getUser.mockResolvedValue({ name: 'test1 user1' } as User)

      const result = await userService.getUser(token)

      expect(result.displayName).toEqual('Test1 User1')
    })
    it('Propagates error', async () => {
      manageUsersApiClientMock.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })
  describe('getUserByUsername', () => {
    beforeEach(() => {
      hmppsAuthClientMock = {
        getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
      } as unknown as jest.Mocked<HmppsAuthClient>
      ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

      manageUsersApiClientMock = {
        getUserByUsername: jest.fn(),
      } as unknown as jest.Mocked<ManageUsersApiClient>
      ;(ManageUsersApiClient as any).mockImplementation(() => manageUsersApiClientMock)

      nomisUserRolesApiClientMock = {
        getDpsUserRoles: jest.fn().mockResolvedValue(['role-1', 'role-2']),
      } as unknown as jest.Mocked<NomisUserRolesApiClient>
      ;(NomisUserRolesApiClient as any).mockImplementation(() => nomisUserRolesApiClientMock)

      userService = new UserService(hmppsAuthClientMock)
    })
    it('Retrieves and formats user name', async () => {
      manageUsersApiClientMock.getUserByUsername.mockResolvedValue({ name: 'test user' } as User)

      const result = await userService.getUserByUsername(token, 'TESTUSER')

      expect(result.displayName).toEqual('Test User')
    })
    it('Propagates error', async () => {
      manageUsersApiClientMock.getUserByUsername.mockRejectedValue(new Error('some error'))

      await expect(userService.getUserByUsername(token, 'TEST1USER1')).rejects.toEqual(new Error('some error'))
    })

    it('should retrieve all roles associated to user', async () => {
      const result = await userService.getDpsUserRoles('username')

      expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('username')
      expect(result).toEqual(['role-1', 'role-2'])
    })
  })
})
