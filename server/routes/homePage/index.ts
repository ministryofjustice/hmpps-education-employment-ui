import type { Router } from 'express'

import HomePageController from './homePageController'
import getUserRolesResolver from '../../middleware/resolvers/getUserRolesResolver'
import checkCmsEnabledHomepage from '../../middleware/checkCmsEnabledHomepage'
import type { Services } from '../../services'

export default (router: Router, _services: Services) => {
  const controller = new HomePageController()

  router.get('/', [checkCmsEnabledHomepage, getUserRolesResolver], controller.get)
}
