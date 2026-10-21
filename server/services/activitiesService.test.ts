import HmppsAuthClient from '../data/hmppsAuthClient'
import ActivitiesApiClient from '../data/activitiesApi/activitiesApiClient'
import GetUnacceptibleAbsenceCountResult from '../data/activitiesApi/getUnacceptibleAbsenceCountResult'
import ActivitiesService from './activitiesService'

jest.mock('../data/activitiesApi/activitiesApiClient')

describe('ActivitiesService', () => {
  let hmppsAuthClient: HmppsAuthClient
  let activitiesService: ActivitiesService

  beforeEach(() => {
    hmppsAuthClient = {
      getSystemClientToken: jest.fn().mockResolvedValue('system-token'),
    } as unknown as HmppsAuthClient
    activitiesService = new ActivitiesService(hmppsAuthClient)
  })

  describe('getUnacceptibleAbsenceCount', () => {
    it('calls ActivitiesApiClient with correct parameters', async () => {
      const id = '123'
      const startDate = new Date('2022-01-01')
      const endDate = new Date('2022-01-31')

      const expectedUnacceptableAbsenceCountResult = {
        acceptableAbsence: 5,
        unacceptableAbsence: 2,
        total: 7,
      } as GetUnacceptibleAbsenceCountResult

      const activitiesApiClientMock = jest.fn().mockImplementation(() => {
        return {
          getUnacceptibleAbsenceCount: jest.fn().mockResolvedValue(expectedUnacceptableAbsenceCountResult),
        }
      })
      ;(ActivitiesApiClient as jest.Mock).mockImplementation(activitiesApiClientMock)

      const result = await activitiesService.getUnacceptibleAbsenceCount('current-username', id, startDate, endDate)

      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith('current-username')
      expect(activitiesApiClientMock).toHaveBeenCalledWith('system-token')
      expect(result).toEqual(expectedUnacceptableAbsenceCountResult)
    })
  })
})
