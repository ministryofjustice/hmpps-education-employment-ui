/* eslint-disable @typescript-eslint/no-explicit-any */
import jwtDecode from 'jwt-decode'
import expressMocks from '../../testutils/expressMocks'
import getUserRolesResolver from './getUserRolesResolver'

jest.mock('jwt-decode', () => jest.fn())

describe('getUserRolesResolver', () => {
  const { req, res, next } = expressMocks()
  res.locals.user = { token: 'fake-token' }

  const mockRoles = ['ROLE_USER', 'ROLE_ADMIN']
  const error = new Error('Invalid token')

  it('On success - Decodes JWT and assigns user roles to request context', async () => {
    ;(jwtDecode as jest.Mock).mockReturnValue({ authorities: mockRoles })

    await getUserRolesResolver(req, res, next)

    expect(req.context.userRoles).toEqual(mockRoles)
    expect(next).toHaveBeenCalledWith()
  })

  it('On error - Calls next with error when JWT decoding fails', async () => {
    ;(jwtDecode as jest.Mock).mockImplementation(() => {
      throw error
    })

    await getUserRolesResolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On missing authorities - Assigns undefined to userRoles', async () => {
    ;(jwtDecode as jest.Mock).mockReturnValue({})

    await getUserRolesResolver(req, res, next)

    expect(req.context.userRoles).toBeUndefined()
    expect(next).toHaveBeenCalledWith()
  })
})
