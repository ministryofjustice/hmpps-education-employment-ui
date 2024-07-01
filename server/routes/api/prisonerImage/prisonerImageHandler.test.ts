/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import PrisonService from '../../../services/prisonService'
import PrisonerImageHandler from './prisonerImageHandler'

describe('PrisonerImageHandler', () => {
  let handler: PrisonerImageHandler
  let mockPrisonService: jest.Mocked<PrisonService>
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: jest.Mock

  beforeEach(() => {
    mockPrisonService = {
      getPrisonerImage: jest.fn(),
    } as any

    handler = new PrisonerImageHandler(mockPrisonService)

    mockReq = {
      params: { id: '123' },
      user: { username: 'testuser' },
    } as any

    mockRes = {
      locals: { user: { username: 'testuser' } },
      set: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>

    mockNext = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should send image when found', async () => {
    const mockImage = { pipe: jest.fn() }
    mockPrisonService.getPrisonerImage.mockResolvedValueOnce(mockImage as any)

    await handler.get(mockReq as Request, mockRes as Response, mockNext)

    expect(mockPrisonService.getPrisonerImage).toHaveBeenCalledWith('testuser', '123')
    expect(mockRes.set).toHaveBeenCalledWith('Content-type', 'image/jpeg')
    expect(mockRes.status).not.toHaveBeenCalled()
    expect(mockImage.pipe).toHaveBeenCalled()
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should send 404 when image not found', async () => {
    mockPrisonService.getPrisonerImage.mockResolvedValueOnce(null)

    await handler.get(mockReq as Request, mockRes as Response, mockNext)

    expect(mockPrisonService.getPrisonerImage).toHaveBeenCalledWith('testuser', '123')
    expect(mockRes.set).not.toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(404)
    expect(mockRes.send).toHaveBeenCalledWith('Not found')
    expect(mockNext).not.toHaveBeenCalled()
  })
})
