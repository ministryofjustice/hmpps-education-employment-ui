/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express'
import homePageRoutes from './homePage'
import accessibilityStatementRoutes from './accessibilityStatement'
import workProfileRoutes from './workProfile'
import { Services } from '../services'
import routes from '.'

jest.mock('./homePage')
jest.mock('./accessibilityStatement')
jest.mock('./workProfile')
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
    expect(homePageRoutes).toHaveBeenCalledWith(router, services)
    expect(accessibilityStatementRoutes).toHaveBeenCalledWith(router)
    expect(workProfileRoutes).toHaveBeenCalledWith(router, services)
  })
})
