import { Request, Response, NextFunction } from 'express'

import config from '../config'
import addressLookup from '../routes/addressLookup'

// Redirect profile if CMS is not enabled
const checkCmsEnabledProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { module, id, tab } = req.params

  // Check module is correct
  if (!['mjma', 'wr'].includes(module)) {
    res.status(404).render('notFoundPage.njk')
    return
  }

  // Check mjma is enabled
  if (module === 'mjma' && !config.featureToggles.candidateMatchingEnabled) {
    res.redirect(addressLookup.workProfile(id, tab))
    return
  }

  next()
}

export default checkCmsEnabledProfile
