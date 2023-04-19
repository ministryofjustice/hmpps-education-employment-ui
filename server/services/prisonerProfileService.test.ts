/* eslint-disable @typescript-eslint/no-explicit-any */
import HmppsAuthClient from '../data/hmppsAuthClient'
import PrisonerProfileClient from '../data/prisonerProfile/prisonerProfileClient'
import PrisonerProfileService from './prisonerProfileService'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/prisonerProfile/prisonerProfileClient')

describe('PrisonService', () => {
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let prisonerProfileClientMock: jest.Mocked<PrisonerProfileClient>
  let prisonerProfileService: PrisonerProfileService
  const offenderId = 'A1234BC'

  beforeEach(() => {
    hmppsAuthClientMock = {
      getSystemClientToken: jest.fn().mockResolvedValue('systemToken'),
    } as unknown as jest.Mocked<HmppsAuthClient>
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClientMock)

    prisonerProfileClientMock = {
      getProfileById: jest.fn().mockResolvedValue({ offenderId }),
      createProfile: jest.fn().mockResolvedValue({ offenderId }),
      updateProfile: jest.fn().mockResolvedValue({ offenderId }),
      getNotes: jest.fn().mockResolvedValue([{ text: 'mockNote' }]),
      createNote: jest.fn().mockResolvedValue([{ text: 'mockNote' }]),
    } as unknown as jest.Mocked<PrisonerProfileClient>
    ;(PrisonerProfileClient as any).mockImplementation(() => prisonerProfileClientMock)

    prisonerProfileService = new PrisonerProfileService(hmppsAuthClientMock)
  })
  describe('#getProfileById', () => {
    it('should call the correct API method with the correct data', async () => {
      const result = await prisonerProfileService.getProfileById('mockToken', offenderId)

      expect(result).toEqual({ offenderId })
      expect(prisonerProfileClientMock.getProfileById).toHaveBeenCalledWith(offenderId)
    })
  })
  describe('#createProfile', () => {
    it('should call the correct API method with the correct data', async () => {
      const result = await prisonerProfileService.createProfile('mockToken', { offenderId } as any)

      expect(result).toEqual({ offenderId })
      expect(prisonerProfileClientMock.createProfile).toHaveBeenCalledWith({ offenderId })
    })
  })
  describe('#updateProfile', () => {
    it('should call the correct API method with the correct data', async () => {
      const result = await prisonerProfileService.updateProfile('mockToken', offenderId, { offenderId } as any)

      expect(result).toEqual({ offenderId })
      expect(prisonerProfileClientMock.updateProfile).toHaveBeenCalledWith(offenderId, { offenderId })
    })
  })
  describe('#getNotes', () => {
    it('should call the correct API method with the correct data', async () => {
      const result = await prisonerProfileService.getNotes('mockToken', offenderId, 'mock_attribute')

      expect(result).toEqual([{ text: 'mockNote' }])
      expect(prisonerProfileClientMock.getNotes).toHaveBeenCalledWith(offenderId, 'MOCK_ATTRIBUTE')
    })
  })
  describe('#createNote', () => {
    it('should call the correct API method with the correct data', async () => {
      const result = await prisonerProfileService.createNote('mockToken', offenderId, 'mock_attribute', 'Mock text')

      expect(result).toEqual([{ text: 'mockNote' }])
      expect(prisonerProfileClientMock.createNote).toHaveBeenCalledWith(offenderId, 'MOCK_ATTRIBUTE', 'Mock text')
    })
  })
})
