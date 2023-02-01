import { stubFor } from '../mockApis/wiremock'

const getTestCohortNameNotExist = {
  content: [],
}

const stubCohortListNameNotExistFilter = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/prisoner-search/release-date-by-prison?lastName=unknown&page=0&size=2000',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        ...getTestCohortNameNotExist,
      },
    },
  })

export default { stubCohortListNameNotExistFilter }
