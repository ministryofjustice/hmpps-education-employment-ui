import jwtDecode from 'jwt-decode'
import type { RequestHandler } from 'express'

import logger from '../../logger'

export enum AuthRole {
  ROLE_EDUCATION_WORK_PLAN_EDITOR = 'ROLE_EDUCATION_WORK_PLAN_EDITOR',
  ROLE_EDUCATION_WORK_PLAN_VIEWER = 'ROLE_EDUCATION_WORK_PLAN_VIEWER',
  ROLE_WORK_READINESS_VIEWER = 'ROLE_WORK_READINESS_VIEWER',
  ROLE_WORK_READINESS_EDITOR = 'ROLE_WORK_READINESS_EDITOR',
  ROLE_JOBS_BOARD_VIEWER = 'ROLE_JOBS_BOARD_VIEWER',
  ROLE_JOBS_BOARD_EDITOR = 'ROLE_JOBS_BOARD_EDITOR',
  ROLE_MATCH_JOBS_EDIT = 'ROLE_MATCH_JOBS_EDIT',

  // Legacy roles
  ROLE_WORK_READINESS_VIEW = 'ROLE_WORK_READINESS_VIEW',
  ROLE_WORK_READINESS_EDIT = 'ROLE_WORK_READINESS_EDIT',
}

export const getAuthorisedRoles = (): string[] =>
  Object.keys(AuthRole).map(key => AuthRole[key as keyof typeof AuthRole])

export const isAuthorisedRole = (role: string): boolean =>
  Object.keys(AuthRole)
    .map(key => AuthRole[key as keyof typeof AuthRole])
    .includes(role as AuthRole)

const authorisationMiddleware = (authorisedRoles: string[] = []): RequestHandler => {
  return (req, res, next) => {
    if (res.locals.user?.token) {
      const { authorities: roles = [] } = jwtDecode(res.locals.user.token) as { authorities?: string[] }
      if (authorisedRoles.length && !roles.some(role => authorisedRoles.includes(role))) {
        logger.error('User is not authorised to access this')
        return res.redirect('/authError')
      }

      return next()
    }

    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in')
  }
}

export default authorisationMiddleware
