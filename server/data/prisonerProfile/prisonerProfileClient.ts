import { plainToClass } from 'class-transformer'

import config from '../../config'
import RestClient from '../restClient'
import PagedResponse from '../domain/types/pagedResponse'
import PrisonerProfileResult from '../prisonerSearch/prisonerProfileResult'
import CreateProfileRequest from '../models/createProfileRequest'
import CreateProfileResponse from './createProfileResponse'
import GetProfileByIdResult from './getProfileByIdResult'
import CreateProfileRequestArgs from './interfaces/createProfileRequestArgs'
import UpdatePrisonerProfile from './interfaces/updatePrisonerProfile'

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

  async updateProfile(prisonerId: string, profile: UpdatePrisonerProfile) {
    const result = await this.restClient.put<CreateProfileResponse>({
      path: `${CREATE_PROFILE_PATH}/${prisonerId}`,
      data: profile,
    })

    return result
  }
}
