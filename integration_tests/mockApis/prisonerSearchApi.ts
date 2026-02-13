import { stubFor } from './wiremock'
import { getTestCohortProfileData } from '../mockData/cohortProfileData'
import { getTestCohortSupportNeeded } from '../mockData/cohortProfileFilterSupportData'
import prisoners from '../mockData/prisonerByIdData'
import prisonersByCaseloadIdAndOffenderId from '../mockData/prisonerByCaseloadIdAndOffenderIdData'

const getPrisonerById = (id = 'G6115VJ') => stubFor(prisoners[id])

const getPrisonerByCaseLoadIdAndOffenderId = (id = 'G6115VJ') => stubFor(prisonersByCaseloadIdAndOffenderId[id])

const stubReadinessProfileSearch = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/readiness-profiles/search',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: getTestCohortProfileData(),
    },
  })

const stubCohortListSupportNeeded = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/prisoner-search/release-date-by-prison?status=SUPPORT_NEEDED&page=0&size=2000',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: getTestCohortSupportNeeded(),
    },
  })

export default {
  getPrisonerByCaseLoadIdAndOffenderId,
  getPrisonerById,
  stubReadinessProfileSearch,
  stubCohortListSupportNeeded,
}
