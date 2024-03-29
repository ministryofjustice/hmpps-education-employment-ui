/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express'
import prisonerListMatchJobs from './prisonerListMatchJobs'
import routes from '.'
import { Services } from '../../services'

jest.mock('./prisonerListMatchJobs')
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
    routes(router as any, services as any)
    expect(prisonerListMatchJobs).toHaveBeenCalledWith(router, services)
  })
})
