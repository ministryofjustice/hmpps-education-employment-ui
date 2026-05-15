import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const stubComponentPing = (status = 200): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/frontendComponents/ping',
    },
    response: {
      status,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: 'UP' },
    },
  })

export default {
  stubComponentPing,
}
