import type { Router } from 'express'

import HomePageController from './homePageController'
import getUserRolesResolver from '../../middleware/resolvers/getUserRolesResolver'
import type { Services } from '../../services'

export default (router: Router, services: Services) => {
  const controller = new HomePageController()

  router.get('/', getUserRolesResolver(services.userService), controller.get)
}
