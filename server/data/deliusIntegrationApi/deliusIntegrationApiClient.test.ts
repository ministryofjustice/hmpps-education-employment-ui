/* eslint-disable @typescript-eslint/no-explicit-any */
import DeliusIntegrationApiClient from './deliusIntegrationApiClient'
import RestClient from '../restClient'
import config from '../../config'

jest.mock('../restClient')

describe('CommunityApiClient', () => {
  let client: DeliusIntegrationApiClient
  let restClientMock: jest.Mocked<RestClient>

  const offenderNo = 'A1234BC'

  beforeEach(() => {
    restClientMock = new RestClient(
      'Community API',
      config.apis.deliusIntegrationApi,
      'token',
    ) as jest.Mocked<RestClient>
    ;(RestClient as any).mockImplementation(() => restClientMock)
    client = new DeliusIntegrationApiClient('token')
  })

  describe('getCommunityManager', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/probation-case/${offenderNo}/community-manager`
      const expectedResult: any = {
        data: 'mock_data',
      }

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getCommunityManager(offenderNo)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(expectedResult)
    })
  })
})
