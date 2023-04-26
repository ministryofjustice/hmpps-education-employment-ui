/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express'
import workProfileRoutes from './workProfile'
import cohortListRoutes from './cohortList'
import createProfileRoutes from './createProfile'
import changeStatusRoutes from './changeStatus'
import actionsRoutes from './actions'
import accessibilityStatementRoutes from './accessibilityStatement'
import { Services } from '../services'
import routes from '.'

jest.mock('./workProfile')
jest.mock('./cohortList')
jest.mock('./createProfile')
jest.mock('./changeStatus')
jest.mock('./actions')
jest.mock('./accessibilityStatement')
jest.mock('express', () => ({
  Router: jest.fn().mockImplementation(() => ({
    use: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

describe('Server routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = Router() as Router
    ;(Router as any).mockImplementation(() => router)
    services = {} as Services
  })

  it('calls editActionRoutes with router and services', () => {
    routes(services as any)
    expect(workProfileRoutes).toHaveBeenCalledWith(router, services)
    expect(cohortListRoutes).toHaveBeenCalledWith(router, services)
    expect(createProfileRoutes).toHaveBeenCalledWith(router, services)
    expect(changeStatusRoutes).toHaveBeenCalledWith(router, services)
    expect(actionsRoutes).toHaveBeenCalledWith(router, services)
    expect(accessibilityStatementRoutes).toHaveBeenCalledWith(router)
  })
})
