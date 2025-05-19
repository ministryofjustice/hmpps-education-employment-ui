/* eslint-disable @typescript-eslint/no-explicit-any */
import AllocationManagerApiClient from '../data/allocationManagerApi/allocationManagerApiClient'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'
import AllocationManagerService from './allocationManagerService'
import HmppsAuthClient from '../data/hmppsAuthClient'

jest.mock('../data/nomisUserRolesApi/nomisUserRolesApiClient')
jest.mock('../data/allocationManagerApi/allocationManagerApiClient')
jest.mock('../data/hmppsAuthClient')

describe('AllocationManagerService', () => {
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let allocationManagerApiClientMock: jest.Mocked<AllocationManagerApiClient>
  let nomisUserRolesApiClientMock: jest.Mocked<NomisUserRolesApiClient>
  let allocationManagerService: AllocationManagerService

  beforeEach(() => {
    hmppsAuthClientMock = {
      getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
    } as unknown as jest.Mocked<HmppsAuthClient>
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

    allocationManagerApiClientMock = {
      getPomForOffender: jest.fn().mockResolvedValue({ primary_pom: { staff_id: '123' } }),
    } as unknown as jest.Mocked<AllocationManagerApiClient>
    ;(AllocationManagerApiClient as any).mockImplementation(() => allocationManagerApiClientMock)

    nomisUserRolesApiClientMock = {
      getStaffDetails: jest
        .fn()
        .mockResolvedValue({ firstName: 'Test1', lastName: 'User1', primaryEmail: 'test1.user1@nomis.com' }),
    } as unknown as jest.Mocked<NomisUserRolesApiClient>
    ;(NomisUserRolesApiClient as any).mockImplementation(() => nomisUserRolesApiClientMock)

    allocationManagerService = new AllocationManagerService(hmppsAuthClientMock)
  })

  it('should return the POM details for the given offender', async () => {
    const result = await allocationManagerService.getPomForOffender('user', 'offender')

    expect(result).toEqual({
      firstName: 'Test1',
      lastName: 'User1',
      email: 'test1.user1@nomis.com',
    })

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('user')
    expect(allocationManagerApiClientMock.getPomForOffender).toHaveBeenCalledWith('offender')
    expect(nomisUserRolesApiClientMock.getStaffDetails).toHaveBeenCalledWith('123')
  })
})
