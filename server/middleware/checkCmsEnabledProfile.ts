import { Request, Response, NextFunction } from 'express'

import config from '../config'
import addressLookup from '../routes/addressLookup'

// Redirect profile if CMS is not enabled
const checkCmsEnabledProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { module, id, tab } = req.params

  if (module === 'cms' && !config.featureToggles.candidateMatchingEnabled) {
    res.redirect(addressLookup.workReadiness.workProfile(id, tab))
    return
  }

  next()
}

export default checkCmsEnabledProfile
