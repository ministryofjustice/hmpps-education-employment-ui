import { Router } from 'express'
import editActionRoutes from './editAction'
import { Services } from '../../services'
import routes from '.'

jest.mock('./editAction')

describe('Actions routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = {} as Router
    services = {} as Services
  })

  it('calls editActionRoutes with router and services', () => {
    routes(router, services)
    expect(editActionRoutes).toHaveBeenCalledWith(router, services)
  })
})
