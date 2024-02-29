/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express'
import { hasAnyRole } from '../../utils/index'
import addressLookup from '../addressLookup'

interface RoleCode {
  roleCodes: string[]
}

export default class HomePageController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { userRoles } = req.context

    try {
      // Prepare tasks that will constitute the tiles
      const roleCodes = [...userRoles.map((userRole: RoleCode) => userRole)]
      const getTasks = (roleCodes: any) => {
        const userHasRoles = (roles: string[]) => hasAnyRole(roles, roleCodes)

        return [
          {
            id: 'get-someone-ready-to-work',
            heading: 'Get someone ready to work',
            description:
              'Record what support a prisoner needs to get work. View who has been assessed as ready to work.',
            href: addressLookup.workReadiness.cohortList(),
            enabled: () => userHasRoles(['WORK_READINESS_VIEW', 'WORK_READINESS_EDIT']),
          },
          {
            id: 'match-jobs-and-manage-applications',
            heading: 'Match jobs and manage applications',
            description: 'View jobs matched by work interests and release area. Manage the status of job applications.',
            href: addressLookup.candidateMatching.prisonerMatchJobsList(),
            enabled: () => userHasRoles(['EDUCATION_WORK_PLAN_EDITOR', 'EDUCATION_WORK_PLAN_VIEWER']),
          },
          {
            id: 'reporting_data',
            heading: 'Reporting data',
            description: 'Create reports showing progress against work after release metrics.',
            href: '/reporting',
            enabled: () => userHasRoles(['EDUCATION_WORK_PLAN_EDITOR', 'EDUCATION_WORK_PLAN_VIEWER']),
          },
        ]
      }

      // Render data
      const allTasks = getTasks(roleCodes)
      res.render('pages/homePage/index.njk', {
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
