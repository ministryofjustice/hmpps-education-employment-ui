/* eslint-disable @typescript-eslint/no-explicit-any */
import DeliusIntegrationApiClient from '../data/deliusIntegrationApi/deliusIntegrationApiClient'
import HmppsAuthClient from '../data/hmppsAuthClient'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'
import DeliusIntegrationService from './deliusIntegrationService'

jest.mock('../data/deliusIntegrationApi/deliusIntegrationApiClient')
jest.mock('../data/hmppsAuthClient')
jest.mock('../data/nomisUserRolesApi/nomisUserRolesApiClient')

describe('CommunityService', () => {
  let deliusIntegrationService: DeliusIntegrationService
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>
  let deliusIntegrationApiClient: jest.Mocked<DeliusIntegrationApiClient>
  let nomisUserRolesApiClient: jest.Mocked<NomisUserRolesApiClient>

  beforeEach(() => {
    hmppsAuthClient = new HmppsAuthClient({} as any) as jest.Mocked<HmppsAuthClient>
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClient)

    deliusIntegrationApiClient = new DeliusIntegrationApiClient({} as any) as jest.Mocked<DeliusIntegrationApiClient>
    ;(DeliusIntegrationApiClient as any).mockImplementation(() => deliusIntegrationApiClient)

    nomisUserRolesApiClient = new NomisUserRolesApiClient({} as any) as jest.Mocked<NomisUserRolesApiClient>
    ;(NomisUserRolesApiClient as any).mockImplementation(() => nomisUserRolesApiClient)

    deliusIntegrationService = new DeliusIntegrationService(hmppsAuthClient)
  })

  describe('getComForOffender', () => {
    it('returns undefined if no community manager found', async () => {
      const systemToken = 'token'
      const username = 'user'
      const id = '123'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
      deliusIntegrationApiClient.getCommunityManager.mockResolvedValue(undefined)

      const result = await deliusIntegrationService.getComForOffender(username, id)

      expect(result).toBeUndefined()
    })

    it('returns staff details if community manager found', async () => {
      const systemToken = 'token'
      const username = 'user'
      const id = '123'
      const staffDetails: any = {
        firstName: 'John',
        lastName: 'Doe',
        primaryEmail: 'john.doe@example.com',
        staffId: 456,
        status: 'mock_status',
        generalAccount: true,
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
      deliusIntegrationApiClient.getCommunityManager.mockResolvedValue({
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      } as any)
      nomisUserRolesApiClient.getStaffDetails.mockResolvedValue(staffDetails)

      const result = await deliusIntegrationService.getComForOffender(username, id)

      expect(result).toEqual({
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      })
    })

    it('returns fallback details if staff details not found', async () => {
      const systemToken = 'token'
      const username = 'user'
      const id = '123'
      const com = {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
      deliusIntegrationApiClient.getCommunityManager.mockResolvedValue({
        ...com,
      } as any)
      nomisUserRolesApiClient.getStaffDetails.mockResolvedValue(undefined)

      const result = await deliusIntegrationService.getComForOffender(username, id)

      expect(result).toEqual({
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      })
    })
  })

  describe('getAddressForOffender', () => {
    it('returns undefined if no address found', async () => {
      const systemToken = 'token'
      const username = 'user'
      const id = '123'

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
      deliusIntegrationApiClient.getCommunityManager.mockResolvedValue(undefined)

      const result = await deliusIntegrationService.getAddressForOffender(username, id)

      expect(result).toBeUndefined()
    })

    it('returns address details if address found', async () => {
      const systemToken = 'token'
      const username = 'user'
      const id = '123'
      const address: any = {
        buildingName: 'buildingName',
        addressNumber: 'addressNumber',
        streetName: 'streetName',
        district: 'district',
        town: 'town',
        county: 'county',
        postcode: 'postcode',
        noFixedAbode: false,
      }
      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
      deliusIntegrationApiClient.getPrisonerAddress.mockResolvedValue({
        ...address,
      } as any)

      const result = await deliusIntegrationService.getAddressForOffender(username, id)

      expect(result).toEqual({
        ...address,
      })
    })
  })
})
