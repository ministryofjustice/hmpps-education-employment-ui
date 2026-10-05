/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import populateCurrentUser from './populateCurrentUser'
import UserService from '../services/userService'

jest.mock('../services/userService')
jest.mock('../../logger')

describe('populateCurrentUser middleware', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  const nextFunction = jest.fn()
  let mockedUserService: jest.Mocked<UserService>

  const createToken = (userUuid: string) => {
    const payload = {
      user_name: 'USER1',
      scope: ['read', 'write'],
      auth_source: 'nomis',
      user_uuid: userUuid,
      jti: 'a610a10-cca6-41db-985f-e87efb303aaf',
      client_id: 'clientid',
    }
    return jwt.sign(payload, 'secret', { expiresIn: '1h' })
  }

  beforeEach(() => {
    mockedUserService = {
      getUser: jest.fn(),
    } as unknown as jest.Mocked<UserService>
    ;(UserService as any).mockImplementation(() => mockedUserService)

    mockReq = {}
    mockRes = {
      locals: {
        user: {
          token: '123',
          username: 'testuser',
        },
      },
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call next function when no user is provided', async () => {
    mockRes.locals.user = undefined

    await populateCurrentUser(mockedUserService as any)(mockReq as Request, mockRes as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalled()
  })

  it('should populate user when valid token is provided', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'testuser@example.com',
    }
    mockedUserService.getUser.mockResolvedValue(mockUser as any)
    mockRes.locals.user.token = createToken('11111111-1111-1111-1111-111111111111')

    await populateCurrentUser(mockedUserService as any)(mockReq as Request, mockRes as Response, nextFunction)

    expect(mockRes.locals.user.userUuid).toEqual('11111111-1111-1111-1111-111111111111')
    expect(mockRes.locals.user).toEqual(expect.objectContaining(mockUser))
    expect(nextFunction).toHaveBeenCalled()
  })

  it('should log error and call next function when failed to retrieve user', async () => {
    mockedUserService.getUser.mockRejectedValue(new Error('Failed to get user'))

    await populateCurrentUser(mockedUserService as any)(mockReq as Request, mockRes as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalledWith(new Error('Failed to get user'))
  })
})
