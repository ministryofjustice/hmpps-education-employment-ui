import { stubFor } from './wiremock'

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

const searchByReleaseDateRaw = () =>
  stubFor({
    request: {
      method: 'GET',
      url: 'pages/cohortList/index',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        firstName: 'Daniel',
        lastName: 'Craig',
        releaseDate: new Date('2023-10-01'),
        status: 'NOT_STARTED',
        workSummary: 'N/A',
        updatedOn: 'N/A',
      },
    },
  })

const stubUserCaseLoads = () =>
  stubFor({
    request: {
      method: 'GET',
      url: '/nomis-user-dev.aks-dev-1.studio-hosting.service.justice.gov.uk',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { caseloads: [{ id: 'MDI' }, { id: 'LEI' }] },
    },
  })

export default {
  getPrisonerById,
  searchByReleaseDateRaw,
  stubUserCaseLoads,
}
