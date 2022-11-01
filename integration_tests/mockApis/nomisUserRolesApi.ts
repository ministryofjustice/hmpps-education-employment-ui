import { stubFor } from './wiremock'

const getUserActiveCaseLoad = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: '/nomisUserRolesApi/users/USER1/caseloads',
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
  getUserActiveCaseLoad,
}
