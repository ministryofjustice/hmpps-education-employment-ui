import { Router } from 'express'
import FeaturesEnabledHandler from './featuresEnabledHandler'

export default function routes(router: Router): void {
  const handler = new FeaturesEnabledHandler()

  router.get('/api/features-enabled', handler.get)
}
