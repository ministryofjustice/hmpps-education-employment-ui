import { plainToClass } from 'class-transformer'

import config from '../../config'
import RestClient from '../restClient'
import PagedResponse from '../domain/types/pagedResponse'
import PrisonerProfileResult from '../prisonerSearch/prisonerProfileResult'
import CreateProfileRequest from './createProfileRequest'
import CreateProfileResponse from './createProfileResponse'
import GetProfileByIdResult from './getProfileByIdResult'
import CreateProfileRequestArgs from './interfaces/createProfileRequestArgs'
import UpdateProfileRequest from './updateProfileRequest'
import PrisonerProfile from './interfaces/prisonerProfile'

const PRISONER_EDUCATION_PROFILE_PATH = '/readiness-profiles/search'
const CREATE_PROFILE_PATH = '/readiness-profiles'
const GET_PROFILE_BY_ID_PATH = '/readiness-profiles'

export default class PrisonerProfileClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Prisoner Profile Search', config.apis.esweProfileApi, token)
  }

  async getProfileById(id: string) {
    const profile = await this.restClient.get<GetProfileByIdResult>({
      path: `${GET_PROFILE_BY_ID_PATH}/${id}`,
    })

    return plainToClass(GetProfileByIdResult, profile)
  }

  async profileData(offenderList: string[]) {
    const searchProfile = PRISONER_EDUCATION_PROFILE_PATH

    const profileResults = await this.restClient.post<PagedResponse<PrisonerProfileResult>>({
      path: `${searchProfile}`,
      data: offenderList,
    })
    return profileResults
  }

  async getPrisonerProfilesByIds(offenderList: string[]) {
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

  async updateProfile(newProfile: CreateProfileRequestArgs, existingProfile: PrisonerProfile) {
    const result = await this.restClient.post<CreateProfileResponse>({
      path: `${CREATE_PROFILE_PATH}/${newProfile.prisonerId}`,
      data: new UpdateProfileRequest(newProfile, existingProfile),
    })

    return result
  }
}
