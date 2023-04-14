import KeyworkerApiClient from './keyworkerApiClient'
import RestClient from '../restClient'
import config from '../../config'

// Mock the RestClient
jest.mock('../restClient')

const BASE_URL = '/key-worker'

describe('KeyworkerApiClient', () => {
  let client: KeyworkerApiClient
  let restClientMock: jest.Mocked<RestClient>

  const mockToken = 'mockToken'

  beforeEach(() => {
    // Clear all instances and calls to constructor/mocks before each test
    restClientMock = new RestClient('Keyworker API', config.apis.keyworkerApi, 'token') as jest.Mocked<RestClient>
    ;(RestClient as any).mockImplementation(() => restClientMock)
    client = new KeyworkerApiClient(mockToken)
  })

  describe('getKeyworkerForOffender', () => {
    const offenderNo = '12345'

    it('should call RestClient.get with correct path and return the result', async () => {
      const expectedPath = `${BASE_URL}/offender/${offenderNo}`
      const expectedResult = {
        staffId: 12345,
        firstName: 'Bob',
        lastName: 'Smith',
      }

      // Mock the RestClient.get method
      restClientMock.get.mockResolvedValue(expectedResult)

      // Call the getKeyworkerForOffender method and get the result
      const result = await client.getKeyworkerForOffender(offenderNo)

      // Expect the RestClient.get method to have been called with the correct arguments
      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })

      // Expect the result to be equal to the mock response
      expect(result).toEqual(expectedResult)
    })
  })
})
