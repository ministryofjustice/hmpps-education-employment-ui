import superagent, { SuperAgentRequest, Response } from 'superagent'

const url = 'http://localhost:9091/__admin'

const stubFor = (mapping: Record<string, unknown>): SuperAgentRequest =>
  superagent.post(`${url}/mappings`).send(mapping)

const getMatchingRequests = (body: Record<string, unknown>): SuperAgentRequest =>
  superagent.post(`${url}/requests/find`).send(body)

const resetStubs = (): Promise<Array<Response>> =>
  Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

const stubFromMapping = (mappings: Record<string, Record<string, unknown>>, key: string): SuperAgentRequest => {
  if (!Object.prototype.hasOwnProperty.call(mappings, key)) {
    throw new Error(`No Wiremock mapping configured for key "${key}"`)
  }
  return stubFor(mappings[key])
}

export { stubFor, getMatchingRequests, resetStubs, stubFromMapping }
