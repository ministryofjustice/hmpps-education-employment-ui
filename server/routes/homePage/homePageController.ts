/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import { hasAnyRole } from '../../utils/index'
import addressLookup from '../addressLookup'
import config from '../../config'

export default class HomePageController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { userRoles } = req.context

    try {
      // Render data
      const data = {
        tasks: getTasks(userRoles)
          .filter(task => task.enabled())
          .map(task => ({
            id: task.id,
            href: task.href,
            heading: task.heading,
            description: task.description,
          })),
        subTasks: getSubTasks(userRoles)
          .filter(task => task.enabled())
          .map(task => ({
            id: task.id,
            href: task.href,
            heading: task.heading,
            description: task.description,
          })),
      }

      res.render('pages/homePage/index.njk', { ...data })
    } catch (err) {
      next(err)
    }
  }
}

const getTasks = (userRoles: any) => {
  const userHasRoles = (roles: string[]) => hasAnyRole(roles, userRoles)

  return [
    {
      id: 'get-someone-ready-to-work',
      heading: 'Get someone ready to work',
      description: 'Record what support a prisoner needs to get work. View who has been assessed as ready to work.',
      href: `${addressLookup.workReadiness.cohortList()}?sort=releaseDate&order=ascending`,
      enabled: () => userHasRoles(['ROLE_WORK_READINESS_VIEW', 'ROLE_WORK_READINESS_EDIT']),
    },
    {
      id: 'match-jobs-and-manage-applications',
      heading: 'Match jobs and manage applications',
      description: 'View jobs matched by work interests and release area. Manage the status of job applications.',
      href: `${addressLookup.candidateMatching.prisonerListMatchJobs()}?sort=releaseDate&order=ascending`,
      enabled: () =>
        userHasRoles(['ROLE_EDUCATION_WORK_PLAN_EDITOR', 'ROLE_EDUCATION_WORK_PLAN_VIEWER', 'ROLE_MATCH_JOBS_EDIT']),
    },
    {
      id: 'reporting_data',
      heading: 'Reporting data',
      description: 'Create reports showing progress against work after release metrics.',
      href: config.reportingUrl,
      enabled: () =>
        userHasRoles(['ROLE_EDUCATION_WORK_PLAN_EDITOR', 'ROLE_EDUCATION_WORK_PLAN_VIEWER', 'ROLE_MATCH_JOBS_EDIT']) &&
        config.featureToggles.reportingLinkEnabled,
    },
    {
      id: 'jobs-board-reporting',
      heading: 'Reporting dashboard',
      description:
        'View reporting information for all products within Get someone ready to work and Match jobs and manage applications.',
      href: config.jobsBoardReportingUrl,
      enabled: () => userHasRoles(['ROLE_WALP_DASHBOARD_INTERNAL', 'ROLE_WALP_DASHBOARD_EXTERNAL']),
    },
  ]
}

const getSubTasks = (userRoles: any) => {
  const userHasRoles = (roles: string[]) => hasAnyRole(roles, userRoles)

  return [
    {
      id: 'jobs-upload',
      heading: config.featureToggles.brokerIterationEnabled ? 'Manage jobs and employers' : 'Add jobs and employers',
      description: 'Add and manage job vacancies and employer information.',
      href: config.jobUploadUrl,
      enabled: () => userHasRoles(['ROLE_JOBS_BOARD_VIEWER', 'ROLE_JOBS_BOARD_EDITOR']),
    },
  ]
}
