import { stubFor } from '../mockApis/wiremock'

const getTestCohortListSearchTermNameNotExistWithStatusTimeNoData = {
  content: [],
}

const stubCohortListSearchTermNameNotExistWithSpecificStatusTimeFilter = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/prisoner-search/release-date-by-prison?searchTerm=unknown&status=SUPPORT_NEEDED&timeToRelease=SIX_MONTHS&page=0&size=2000',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        ...getTestCohortListSearchTermNameNotExistWithStatusTimeNoData,
      },
    },
  })

export default { stubCohortListSearchTermNameNotExistWithSpecificStatusTimeFilter }
