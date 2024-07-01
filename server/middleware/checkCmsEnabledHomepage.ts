import { Request, Response, NextFunction } from 'express'

import config from '../config'
import addressLookup from '../routes/addressLookup'

// Redirect homepage if CMS is not enabled
const checkCmsEnabledHomepage = async (req: Request, res: Response, next: NextFunction) => {
  if (!config.featureToggles.candidateMatchingEnabled) {
    res.redirect(`${addressLookup.workReadiness.cohortList()}?sort=releaseDate&order=descending`)
    return
  }

  next()
}

export default checkCmsEnabledHomepage
