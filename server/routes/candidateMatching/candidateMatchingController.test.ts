import expressMocks from '../../testutils/expressMocks'
import CandidateMatchingController from './candidateMatchingController'
import { setSessionData } from '../../utils/session'

jest.mock('../../config', () => ({
  ...jest.requireActual('../../config'),
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('../../utils/utils', () => ({
  ...jest.requireActual('../../utils'),
  __esModule: true,
  default: jest.fn(),
}))

describe('CandidateMatchingController', () => {
  const { req, res, next } = expressMocks()
  req.context.userroles = ['role-1', 'role-2']
  res.locals.user = { username: 'MOCK_USER' }
  const { username } = res.locals.user

  const mockData = {
    locationOptions: {},
    tasks: [
      {
        id: 'get-someone-ready-to-work',
        href: 'https://example.com/get-ready-for-work',
        heading: 'Get someone ready to work',
        description: 'Record what support a prisoner needs to get work. View who has been assessed as ready to work.',
      },
    ],
  }

  const mockService: any = {
    getDpsUserRoles: jest.fn(),
    getTasks: jest.fn(),
  }

  const controller = new CandidateMatchingController()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      setSessionData(req, ['userroles', username, 'data'], mockData)
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('should render no tasks', async () => {
      await controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })

    it('should render tasks', async () => {
      setSessionData(req, ['userroles', username], mockData)
      await controller.get(req, res, next)
      mockService.getTasks.mockResolvedValue(mockData)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledTimes(0)
    })
  })
})
