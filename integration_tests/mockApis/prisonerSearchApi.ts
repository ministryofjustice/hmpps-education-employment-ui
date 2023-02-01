import { stubFor } from './wiremock'
import { getTestCohortProfileData } from '../mockData/cohortProfileData'
import { getTestCohortSupportNeeded } from '../mockData/cohortProfileFilterSupportData'
import prisoners from '../mockData/prisonerByIdData'

const getPrisonerById = (id = 'G6115VJ') => stubFor(prisoners[id])

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

const stubUserCaseLoads = () =>
  stubFor({
    request: {
      method: 'GET',
      url: '/nomisUserRolesApi/users/USER1/caseloads',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        activeCaseload: {
          id: 1,
          name: 'Moorland (HMP & YOI)',
        },
      },
    },
  })

export default {
  getPrisonerById,
  stubReadinessProfileSearch,
  stubCohortListSupportNeeded,
  stubUserCaseLoads,
}
