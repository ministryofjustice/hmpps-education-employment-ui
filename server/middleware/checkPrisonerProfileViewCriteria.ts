import { type RequestHandler } from 'express'
import PrisonerSearchService from '../services/prisonSearchService'
import PrisonerProfileService from '../services/prisonerProfileService'

const MJMA_ALLOWED_PROFILE_STATUSES = ['READY_TO_WORK', 'SUPPORT_NEEDED'] as const

enum Context {
  MJMA = 'mjma',
  WR = 'wr',
  Unknown = 'unknown',
}

const MODULE_REDIRECTS: Record<Context, string> = {
  [Context.MJMA]: '/mjma/prisoners?sort=releaseDate&order=ascending',
  [Context.WR]: '/wr/cohort-list?sort=releaseDate&order=ascending',
  [Context.Unknown]: '/',
}

function getContext(module: string | undefined, originalUrl: string | undefined): Context {
  if (module === Context.MJMA || originalUrl?.includes(`/${Context.MJMA}/`)) {
    return Context.MJMA
  }
  if (module === Context.WR || originalUrl?.includes(`/${Context.WR}/`)) {
    return Context.WR
  }
  return Context.Unknown
}

function getContinueUrl(context: Context): string {
  return MODULE_REDIRECTS[context]
}

const checkPrisonerProfileViewCriteria =
  (prisonerSearchService: PrisonerSearchService, prisonerProfileService: PrisonerProfileService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id, module } = req.params
    const { userActiveCaseLoad, username, user, originalUrl } = res.locals
    const context = getContext(module, originalUrl)

    try {
      const searchByPrisonIdResponse = await prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId(
        username,
        userActiveCaseLoad.caseLoadId,
        id,
      )
      if (searchByPrisonIdResponse.empty || !searchByPrisonIdResponse.content[0]?.releaseDate?.trim()) {
        res.status(404).render('notFoundPage.njk', { continueUrl: getContinueUrl(context) })
        return
      }
      if (context === Context.MJMA) {
        const { profileData } = await prisonerProfileService.getProfileById(user.token, id)

        if (!MJMA_ALLOWED_PROFILE_STATUSES.includes(profileData?.status)) {
          res.status(404).render('notFoundPage.njk', { continueUrl: getContinueUrl(context) })
          return
        }
      }
    } catch (err) {
      res.status(404).render('notFoundPage.njk', {
        continueUrl: getContinueUrl(context),
      })
      return
    }
    next()
  }

export default checkPrisonerProfileViewCriteria
