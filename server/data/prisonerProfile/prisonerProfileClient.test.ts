/* eslint-disable @typescript-eslint/no-explicit-any */
import PrisonerProfileClient from './prisonerProfileClient'
import RestClient from '../restClient'
import config from '../../config'
import CreateProfileRequest from '../models/createProfileRequest'

jest.mock('../restClient')

describe('PrisonerProfileClient', () => {
  let client: PrisonerProfileClient
  let restClientMock: jest.Mocked<RestClient>
  const offenderNo = 'A1234BC'

  beforeEach(() => {
    restClientMock = new RestClient(
      'Prisoner Profile Search',
      config.apis.prisonerSearch,
      'token',
    ) as jest.Mocked<RestClient>
    ;(RestClient as any).mockImplementation(() => restClientMock)
    client = new PrisonerProfileClient('token')
    jest.resetAllMocks()
  })

  describe('#createProfile', () => {
    it('should make a POST request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/readiness-profiles/${offenderNo}`
      const expectedResult: any = [
        {
          prisonerNumber: offenderNo,
        },
      ]

      restClientMock.post.mockResolvedValue(expectedResult)

      const result = await client.createProfile({ prisonerId: offenderNo } as any)

      expect(restClientMock.post).toHaveBeenCalledWith({
        path: expectedPath,
        data: new CreateProfileRequest({
          offenderNo: 'A1234BC',
        } as any),
      })
      expect(result).toEqual(expectedResult)
    })
  })

  describe('#updateProfile', () => {
    it('should make a PUT request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/readiness-profiles/${offenderNo}`
      const expectedResult: any = [
        {
          prisonerNumber: offenderNo,
        },
      ]

      restClientMock.put.mockResolvedValue(expectedResult)

      const result = await client.updateProfile(offenderNo, { prisonerId: offenderNo } as any)

      expect(restClientMock.put).toHaveBeenCalledWith({
        path: expectedPath,
        data: {
          prisonerId: 'A1234BC',
        },
      })
      expect(result).toEqual(expectedResult)
    })
  })

  describe('#getProfileById', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/readiness-profiles/${offenderNo}`
      const expectedResult: any = {
        prisonerNumber: offenderNo,
      }

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getProfileById(offenderNo)

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(expectedResult)
    })
  })

  describe('#getNotes', () => {
    it('should make a GET request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/readiness-profiles/${offenderNo}/notes/MOCK_ATTRIBUTE`
      const expectedResult: any = [
        {
          text: 'mock_note',
        },
      ]

      restClientMock.get.mockResolvedValue(expectedResult)

      const result = await client.getNotes(offenderNo, 'MOCK_ATTRIBUTE')

      expect(restClientMock.get).toHaveBeenCalledWith({
        path: expectedPath,
      })
      expect(result).toEqual(expectedResult)
    })
  })

  describe('#createNote', () => {
    it('should make a POST request to the correct endpoint with the correct parameters', async () => {
      const expectedPath = `/readiness-profiles/${offenderNo}/notes/MOCK_ATTRIBUTE`
      const expectedResult: any = [
        {
          prisonerNumber: offenderNo,
        },
      ]

      restClientMock.post.mockResolvedValue(expectedResult)

      const result = await client.createNote(offenderNo, 'MOCK_ATTRIBUTE', 'mock_note')

      expect(restClientMock.post).toHaveBeenCalledWith({
        path: expectedPath,
        data: {
          text: 'mock_note',
        },
      })
      expect(result).toEqual(expectedResult)
    })
  })
})
