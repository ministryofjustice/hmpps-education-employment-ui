import { type RequestHandler } from 'express'
import PrisonerSearchService from '../services/prisonSearchService'
import PrisonerProfileService from '../services/prisonerProfileService'

const MODULE_REDIRECTS: Record<string, string> = {
  mjma: '/mjma/prisoners?sort=releaseDate&order=ascending',
  wr: '/wr/cohort-list?sort=releaseDate&order=ascending',
  unknown: '/',
}

const MJMA_ALLOWED_PROFILE_STATUSES = ['READY_TO_WORK', 'SUPPORT_NEEDED'] as const

const MJMA_CONTEXT_VALUE = 'mjma'

function getContinueUrl(module: string): string {
  return MODULE_REDIRECTS[module] || MODULE_REDIRECTS.unknown
}

function resolveModule(isMjmaContext: boolean, module: string): string {
  return isMjmaContext ? MJMA_CONTEXT_VALUE : String(module)
}

const checkPrisonerProfileViewCriteria =
  (prisonerSearchService: PrisonerSearchService, prisonerProfileService: PrisonerProfileService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { id, module } = req.params
    const { userActiveCaseLoad, username, user, originalUrl } = res.locals
    const isMjmaContext = module === MJMA_CONTEXT_VALUE || originalUrl?.includes(MJMA_CONTEXT_VALUE)

    try {
      const searchByPrisonIdResponse = await prisonerSearchService.getPrisonerByCaseLoadIdAndOffenderId(
        username,
        userActiveCaseLoad.caseLoadId,
        id,
      )
      if (searchByPrisonIdResponse.empty || !searchByPrisonIdResponse.content[0]?.releaseDate?.trim()) {
        res
          .status(404)
          .render('notFoundPage.njk', { continueUrl: getContinueUrl(resolveModule(isMjmaContext, module)) })
        return
      }
      if (isMjmaContext) {
        const { profileData } = await prisonerProfileService.getProfileById(user.token, id)

        if (!MJMA_ALLOWED_PROFILE_STATUSES.includes(profileData?.status)) {
          res
            .status(404)
            .render('notFoundPage.njk', { continueUrl: getContinueUrl(resolveModule(isMjmaContext, module)) })
          return
        }
      }
    } catch (err) {
      res.status(404).render('notFoundPage.njk', {
        continueUrl: getContinueUrl(resolveModule(isMjmaContext, module)),
      })
      return
    }
    next()
  }

export default checkPrisonerProfileViewCriteria
