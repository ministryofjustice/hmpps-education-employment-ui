/* eslint-disable @typescript-eslint/no-explicit-any */
import KeyworkerApiClient from './keyworkerApiClient'
import RestClient from '../restClient'
import GetStaffAllocationsForOffenderResponse from './getStaffAllocationsForOffenderResponse'
import config from '../../config'

jest.mock('../restClient')

describe('KeyworkerApiClient', () => {
  let client: KeyworkerApiClient
  let restClientMock: jest.Mocked<RestClient>
  const offenderNo = 'A1234BC'

  beforeEach(() => {
    restClientMock = new RestClient('Keyworker API', config.apis.keyworkerApi, 'token') as jest.Mocked<RestClient>
    ;(RestClient as any).mockImplementation(() => restClientMock)
    client = new KeyworkerApiClient('token')
  })

  describe('getStaffAllocationsForOffender', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/prisoners/${offenderNo}/allocations/current?includeContactDetails=true`
      const expectedResult: GetStaffAllocationsForOffenderResponse = {
        allocations: [
          {
            policy: {
              code: 'KEY_WORKER',
              description: 'key worker',
            },
            staffMember: {
              staffId: 123,
              firstName: 'Test1',
              lastName: 'User1',
              emailAddresses: ['test1.user1@nomis.com'],
            },
          },
        ],
      }

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getStaffAllocationsForOffender(offenderNo)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(expectedResult)
    })
  })
})
