/* eslint-disable @typescript-eslint/no-explicit-any */
import ActivitiesApiClient from './activitiesApiClient'
import RestClient from '../restClient'
import GetUnacceptibleAbsenceCountResult from './getUnacceptibleAbsenceCountResult'
import config from '../../config'

jest.mock('../restClient')

describe('ActivitiesApiClient', () => {
  let client: ActivitiesApiClient
  let restClientMock: jest.Mocked<RestClient>

  const prisonerNumber = 'A1234BC'
  const startDate = new Date('2023-04-01')
  const endDate = new Date('2023-04-13')

  beforeEach(() => {
    restClientMock = new RestClient('Activities API', config.apis.activitiesApi, 'token') as jest.Mocked<RestClient>
    ;(RestClient as any).mockImplementation(() => restClientMock)
    client = new ActivitiesApiClient('token')
  })

  describe('getUnacceptibleAbsenceCount', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/attendances/prisoner/${prisonerNumber}/attendance-summary?startDate=2023-04-01&endDate=2023-04-13`
      const expectedResult: GetUnacceptibleAbsenceCountResult = {
        acceptableAbsence: 2,
        unacceptableAbsence: 2,
        total: 4,
      }

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getUnacceptibleAbsenceCount(prisonerNumber, startDate, endDate)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(expectedResult)
    })
  })
})
