/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import { setSessionData } from '../../utils/index'
import getUserRolesResolver from './getUserRolesResolver'

describe('getUserRolesResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  req.context = {}

  const mockRoles = ['ROLE_USER', 'ROLE_ADMIN']
  const userServiceMock = {
    getDpsUserRoles: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = getUserRolesResolver(userServiceMock as any)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('On error - Calls next with error', async () => {
    userServiceMock.getDpsUserRoles.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Roles in session - Attaches roles to context and calls next', async () => {
    setSessionData(req, ['userRoles', 'mock_username'], mockRoles)

    await resolver(req, res, next)

    expect(req.context.userRoles).toEqual(mockRoles)
    expect(next).toHaveBeenCalledWith()
    expect(userServiceMock.getDpsUserRoles).not.toHaveBeenCalled()
  })

  it('On success - Roles not in session - Fetches roles and stores in session', async () => {
    setSessionData(req, ['userRoles', 'mock_username'], undefined)

    userServiceMock.getDpsUserRoles.mockResolvedValue(mockRoles)

    await resolver(req, res, next)

    expect(userServiceMock.getDpsUserRoles).toHaveBeenCalledWith('mock_username')
    expect(req.context.userRoles).toEqual(mockRoles)
    expect(next).toHaveBeenCalledWith()
  })
})
