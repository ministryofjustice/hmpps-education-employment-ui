import type { Router } from 'express'

import AccessibilityStatementController from './accessibilityStatementController'

export default (router: Router) => {
  const controller = new AccessibilityStatementController()

  router.get('/accessibility', controller.get)
}
