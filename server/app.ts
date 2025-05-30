import 'reflect-metadata'
import express from 'express'

import path from 'path'
import createError from 'http-errors'

import dpsComponents from '@ministryofjustice/hmpps-connect-dps-components'
import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import authorisationMiddleware, { getAuthorisedRoles } from './middleware/authorisationMiddleware'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'
import expressContext from './middleware/expressContext'
import routes from './routes'
import type { Services } from './services'
import setUpLocals from './middleware/setUpLocals'
import setUpEnvironmentName from './middleware/setUpEnvironmentName'
import sanitizeBody from './middleware/sanitizeBody'
import sanitizeQuery from './middleware/sanitizeQuery'
import logger from '../logger'
import config from './config'

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(setUpHealthChecks())
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  setUpEnvironmentName(app)
  nunjucksSetup(app, path)
  app.use(setUpAuthentication())
  app.use(setUpLocals())
  app.use(setUpCsrf())
  app.use(setUpCurrentUser(services))
  app.use(expressContext())

  // Sanitize user input
  app.use(sanitizeBody)
  app.use(sanitizeQuery)

  // Get front end components for DPS header
  app.use(
    dpsComponents.getPageComponents({
      dpsUrl: config.dpsHomeUrl,
      logger,
      useFallbacksByDefault: config.useComponentFallbacksByDefault,
    }),
  )

  // Check for authorised roles
  app.use(authorisationMiddleware(getAuthorisedRoles()))

  app.use(routes(services))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
