import express, { Router } from 'express'

import {
  monitoringMiddleware,
  endpointHealthComponent,
  EndpointHealthComponentOptions,
} from '@ministryofjustice/hmpps-monitoring'
import type { ApplicationInfo } from '../applicationInfo'
import logger from '../../logger'
import config from '../config'

export default function setUpHealthChecks(applicationInfo: ApplicationInfo): Router {
  const router = express.Router()

  // Only include APIs in the health check for those with health options.
  const apiConfig = Object.entries(config.apis).filter(([_, config]) => isEndpointHealthComponentOptions(config))

  const middleware = monitoringMiddleware({
    applicationInfo,
    healthComponents: apiConfig.map(([name, options]) =>
      endpointHealthComponent(logger, name, options as EndpointHealthComponentOptions),
    ),
  })

  router.get('/health', middleware.health)
  router.get('/info', middleware.info)
  router.get('/ping', middleware.ping)

  return router
}

function isEndpointHealthComponentOptions(apiConfig: unknown): apiConfig is EndpointHealthComponentOptions {
  // is it object?
  if (typeof apiConfig !== 'object' || apiConfig === null) {
    return false
  }
  // with required health options?
  const healthOptions = apiConfig as { url: unknown; healthPath: unknown }
  return typeof healthOptions.url === 'string' && typeof healthOptions.healthPath === 'string'
}
