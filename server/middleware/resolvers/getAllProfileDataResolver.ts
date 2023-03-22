import type { RequestHandler } from 'express'
import { Services } from '../../services'

import getComById from './utils/getComById'
import getKeyworkerById from './utils/getKeyworkerById'
import getPomById from './utils/getPomById'

// Gets Com based on id parameter and puts it into request context
const getAllProfileDataResolver =
  (services: Services): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user
    const { communityService, allocationManagerService, keyworkerService } = services

    try {
      const [pom, com, keyworker] = await Promise.all([
        getPomById(allocationManagerService, username, id),
        getComById(communityService, username, id),
        getKeyworkerById(keyworkerService, username, id),
      ])

      req.context.pom = pom
      req.context.com = com
      req.context.keyworker = keyworker

      next()
    } catch (err) {
      next()
    }
  }

export default getAllProfileDataResolver
