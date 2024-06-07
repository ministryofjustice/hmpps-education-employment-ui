import { stubFor } from './wiremock'

const getCommunityManager = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      url: `/probation-case/${id}/community-manager`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        firstName: 'Bob',
        lastName: 'Kerk',
        email: 'bob.kirk@testemail.com',
      },
    },
  })

const getPrisonerAddress = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      url: `/probation-case/${id}/main-address`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        buildingName: '',
        addressNumber: '20',
        streetName: 'Church road',
        district: 'The steadings',
        town: 'Leeds',
        county: 'Yorkshire',
        postcode: 'L15 7LR',
        noFixedAbode: false,
      },
    },
  })

export default {
  getCommunityManager,
  getPrisonerAddress,
}
