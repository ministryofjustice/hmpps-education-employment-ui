import expressMocks from '../../testutils/expressMocks'
import HomePageController from './homePageController'

jest.mock('../../config', () => ({
  ...jest.requireActual('../../config'),
  __esModule: true,
  default: {
    reportingUrl: 'reporting_url',
    jobUploadUrl: 'job_upload_url',
    featureToggles: {
      reportingLinkEnabled: true,
    },
  },
}))

describe('HomePageController', () => {
  const { req, res, next } = expressMocks()
  req.context.userRoles = ['ROLE_WORK_READINESS_VIEW', 'ROLE_WORK_READINESS_EDIT']
  res.locals.user = { username: 'MOCK_USER' }

  const controller = new HomePageController()

  describe('#get(req, res)', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
    })

    it('On error - Calls next with error', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })
      controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('should render no tasks', async () => {
      req.context.userRoles = []

      await controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(res.render).toHaveBeenCalledWith('pages/homePage/index.njk', {
        tasks: [],
        subTasks: [],
      })
    })

    it('should render tasks - Work readiness only', async () => {
      req.context.userRoles = ['ROLE_WORK_READINESS_VIEW', 'ROLE_WORK_READINESS_EDIT']

      await controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(res.render).toHaveBeenCalledWith('pages/homePage/index.njk', {
        tasks: [
          {
            id: 'get-someone-ready-to-work',
            href: '/wr/cohort-list?sort=releaseDate&order=ascending',
            heading: 'Get someone ready to work',
            description:
              'Record what support a prisoner needs to get work. View who has been assessed as ready to work.',
          },
        ],
        subTasks: [],
      })
    })

    it('should render tasks - all tasks ', async () => {
      req.context.userRoles = [
        'ROLE_EDUCATION_WORK_PLAN_EDITOR',
        'ROLE_EDUCATION_WORK_PLAN_VIEWER',
        'ROLE_WORK_READINESS_VIEW',
        'ROLE_WORK_READINESS_EDIT',
        'ROLE_JOBS_BOARD_VIEWER',
        'ROLE_JOBS_BOARD_EDITOR',
        'ROLE_MATCH_JOBS_EDIT',
      ]

      await controller.get(req, res, next)

      expect(next).toHaveBeenCalledTimes(0)
      expect(res.render).toHaveBeenCalledWith('pages/homePage/index.njk', {
        subTasks: [
          {
            description: 'Add and manage job vacancies and employer information.',
            heading: 'Add jobs and employers',
            href: 'job_upload_url',
            id: 'jobs-upload',
          },
        ],
        tasks: [
          {
            description:
              'Record what support a prisoner needs to get work. View who has been assessed as ready to work.',
            heading: 'Get someone ready to work',
            href: '/wr/cohort-list?sort=releaseDate&order=ascending',
            id: 'get-someone-ready-to-work',
          },
          {
            description: 'View jobs matched by work interests and release area. Manage the status of job applications.',
            heading: 'Match jobs and manage applications',
            href: '/mjma/prisoners?sort=releaseDate&order=ascending',
            id: 'match-jobs-and-manage-applications',
          },
          {
            description: 'Create reports showing progress against work after release metrics.',
            heading: 'Reporting data',
            href: 'reporting_url',
            id: 'reporting_data',
          },
        ],
      })
    })
  })
})
