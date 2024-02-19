/* eslint-disable @typescript-eslint/no-explicit-any */
import HmppsAuthClient from '../data/hmppsAuthClient'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'
import CandidateMatchingService from './candidateMatchingService'

jest.mock('../data/nomisUserRolesApi/nomisUserRolesApiClient')
jest.mock('../data/hmppsAuthClient')

describe('CandidateMatchingService', () => {
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let nomisUserRolesApiClientMock: jest.Mocked<NomisUserRolesApiClient>
  let candidateMatchingService: CandidateMatchingService

  beforeEach(() => {
    hmppsAuthClientMock = {
      getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
    } as unknown as jest.Mocked<HmppsAuthClient>
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

    nomisUserRolesApiClientMock = {
      getDpsUserRoles: jest.fn().mockResolvedValue(['role-1', 'role-2']),
    } as unknown as jest.Mocked<NomisUserRolesApiClient>
    ;(NomisUserRolesApiClient as any).mockImplementation(() => nomisUserRolesApiClientMock)

    candidateMatchingService = new CandidateMatchingService(hmppsAuthClientMock)
  })

  it('should retrieve all roles associated to user', async () => {
    const result = await candidateMatchingService.getDpsUserRoles('username')

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith('username')
    expect(result).toEqual(['role-1', 'role-2'])
  })
})
