import type { RequestHandler } from 'express'

import DeliusIntegrationService from '../../services/deliusIntegrationService'
import { getSessionData, setSessionData } from '../../utils/session'
import getPrisonerAddressById from './utils/getPrisonerAddressById'

// Gets Prisoner Address based on id parameter and puts it into request context
const getPrisonerAddressByIdResolver =
  (deliusIntegrationService: DeliusIntegrationService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { username } = res.locals.user

    try {
      // Check session for cached Prisoner Address
      if (getSessionData(req, ['prisonerAddress', id])) {
        req.context.prisonerAddress = getSessionData(req, ['prisonerAddress', id])
        next()
        return
      }

      // Get Prisoner Address
      req.context.prisonerAddress = await getPrisonerAddressById(deliusIntegrationService, username, id)
      setSessionData(req, ['prisonerAddress', id], req.context.prisonerAddress)

      next()
    } catch (err) {
      next(err)
    }
  }

export default getPrisonerAddressByIdResolver
