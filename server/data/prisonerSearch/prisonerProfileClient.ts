import config from '../../config'
import RestClient from '../restClient'
import PagedResponse from '../domain/types/pagedResponse'
import PrisonerProfileResult from './prisonerProfileResult'

const PRISONER_EDUCATION_PROFILE_PATH = '/readiness-profiles/search'

export default class PrisonerProfileClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Prisoner Profile Search', config.apis.esweProfileApi, token)
  }

  async profileData(offenderList: string[]) {
    const searchProfile = PRISONER_EDUCATION_PROFILE_PATH

    const profileResults = await this.restClient.post<PagedResponse<PrisonerProfileResult>>({
      path: `${searchProfile}`,
      data: offenderList,
    })
    return profileResults
  }

  async getPrisonerProfileProfileData(offenderList: string[]) {
    const searchProfile = PRISONER_EDUCATION_PROFILE_PATH

    const profileResults = await this.restClient.post<string[]>({
      path: `${searchProfile}`,
      data: offenderList,
    })
    return profileResults
  }
}
