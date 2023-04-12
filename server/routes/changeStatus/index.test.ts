import { Router } from 'express'
import newStatusRoutes from './newStatus'
import newStatusPauseRoutes from './newStatusPause'
import { Services } from '../../services'
import routes from '.'

jest.mock('./newStatus')
jest.mock('./newStatusPause')

describe('Actions routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = {} as Router
    services = {} as Services
  })

  it('calls editActionRoutes with router and services', () => {
    routes(router, services)
    expect(newStatusRoutes).toHaveBeenCalledWith(router, services)
    expect(newStatusPauseRoutes).toHaveBeenCalledWith(router, services)
  })
})
