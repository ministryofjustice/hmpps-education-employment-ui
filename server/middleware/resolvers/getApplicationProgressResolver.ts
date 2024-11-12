/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestHandler } from 'express'

import getApplicationProgress from './utils/getApplicationProgress'
import JobApplicationService from '../../services/jobApplicationService'
import UserService from '../../services/userService'
import { getUserFullName } from './utils'
import logger from '../../../logger'

const getApplicationProgressResolver =
  (jobApplicationService: JobApplicationService, userService: UserService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user
    const { id, jobId } = req.params

    try {
      const applicationProgress = await getApplicationProgress(jobApplicationService, username, id, jobId)

      req.context.applicationProgress = applicationProgress

      // Get display names in parallel
      if (req.context.applicationProgress && req.context.applicationProgress.length) {
        // Set up promises
        const promises = req.context.applicationProgress.map(async (progress: { modifiedBy: string }) => {
          const displayName = await getUserFullName(req, res, userService, progress.modifiedBy)
          return displayName
        })

        // Process requests
        const results = await Promise.all(promises)

        // Merge results
        req.context.applicationProgress = req.context.applicationProgress.map((progress: any, index: number) => ({
          ...progress,
          modifiedByNameDisplay: results[index],
        }))
      }

      next()
    } catch (err) {
      logger.error('Error getting data - Application history')
      next(err)
    }
  }

export default getApplicationProgressResolver
