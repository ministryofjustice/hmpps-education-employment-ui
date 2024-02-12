/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import { hasAnyRole } from '../../utils/utils'
import config from '../../config'

interface RoleCode {
  roleCodes: string[]
}

export default class CandidateMatchingController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const userRoles = req.context.userroles

    try {
      // Prepare tasks that will constitute the tiles
      const roleCodes = [...userRoles.map((userRole: any) => userRole)]
      const getTasks = ({ roleCodes }: RoleCode) => {
        const userHasRoles = (roles: any) => hasAnyRole(roleCodes, roles)

        return [
          {
            id: 'get-someone-ready-to-work',
            heading: 'Get someone ready to work',
            description:
              'Record what support a prisoner needs to get work. View who has been assessed as ready to work.',
            href: `${config.getSomeoneReadyForWork.ui_url}?sort=releaseDate&order=descending`,
            enabled: () =>
              config.getSomeoneReadyForWork.ui_url && userHasRoles(['WORK_READINESS_VIEW', 'WORK_READINESS_EDIT']),
          },
          {
            id: 'match-jobs-and-manage-applications',
            heading: 'Match jobs and manage applications',
            description: 'View jobs matched by work interests and release area. Manage the status of job applications.',
            href: config.matchJobsAndManageApplications.ui_url,
            enabled: () =>
              config.matchJobsAndManageApplications.ui_url &&
              userHasRoles(['EDUCATION_WORK_PLAN_EDITOR', 'EDUCATION_WORK_PLAN_VIEWER']),
          },
          {
            id: 'reporting_data',
            heading: 'Reporting data',
            description: 'Create reports showing progress against work after release metrics.',
            href: config.reportingData.ui_url,
            enabled: () =>
              config.reportingData.ui_url && userHasRoles(['EDUCATION_WORK_PLAN_EDITOR', 'EDUCATION_WORK_PLAN_VIEWER']),
          },
        ]
      }

      // Render data
      const allTasks = getTasks({ roleCodes })
      res.render('pages/candidateMatching/index.njk', {
        locationOptions: null,
        tasks: allTasks
          .filter(task => task.enabled())
          .map(task => ({
            id: task.id,
            href: task.href,
            heading: task.heading,
            description: task.description,
          })),
      })
    } catch (err) {
      next(err)
    }
  }
}
