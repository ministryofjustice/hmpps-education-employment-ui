import { stubFor } from '../mockApis/wiremock'

const getTestCohortListNoSearchTermNotExistData = {
  content: [],
}

const stubCohortListNoSearchTermNotExistFilter = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/prisoner-search/release-date-by-prison?page=0&size=2000',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        ...getTestCohortListNoSearchTermNotExistData,
      },
    },
  })

export default { stubCohortListNoSearchTermNotExistFilter }
