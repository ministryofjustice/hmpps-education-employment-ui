import { stubFor } from './wiremock'
import { getTestCohortProfileData } from '../mockData/cohortProfileData'
import { getTestCohortSupportNeeded } from '../mockData/cohortProfileFilterSupportData'

const getPrisonerById = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prisoner/G6115VJ',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        firstName: 'Daniel',
        lastName: 'Craig',
      },
    },
  })

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
      url: '/prisoner-search/release-date-by-prison?status=SUPPORT_NEEDED&searchTerm=&page=0&size=2000',
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
