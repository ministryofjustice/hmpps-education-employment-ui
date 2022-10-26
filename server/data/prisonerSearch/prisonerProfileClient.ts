import config from '../../config'
import RestClient from '../restClient'
import PagedResponse from '../domain/types/pagedResponse'
import PrisonerProfileResult from './prisonerProfileResult'
import { CreateProfileRequest, CreateProfileRequestArgs } from './createProfileRequest'
import CreateProfileResponse from './createProfileResponse'

const PRISONER_EDUCATION_PROFILE_PATH = '/readiness-profiles/search'
const CREATE_PROFILE_PATH = '/readiness-profiles'

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

  async createProfile(newProfile: CreateProfileRequestArgs) {
    const result = await this.restClient.post<CreateProfileResponse>({
      path: `${CREATE_PROFILE_PATH}/${newProfile.prisonerId}`,
      data: new CreateProfileRequest(newProfile),
    })
    return result
  }
}
