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
import AlreadyInPlaceValue from '../../enums/alreadyInPlaceValue'
import Note from './interfaces/note'

const BASE_URL = '/readiness-profiles'

export default class PrisonerProfileClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Prisoner Profile Search', config.apis.esweProfileApi, token)
  }

  async getProfileById(id: string) {
    const profile = await this.restClient.get<GetProfileByIdResult>({
      path: `${BASE_URL}/${id}`,
    })

    return plainToClass(GetProfileByIdResult, profile)
  }

  async profileData(offenderList: string[]) {
    const searchProfile = `${BASE_URL}/search`

    const profileResults = await this.restClient.post<PagedResponse<PrisonerProfileResult>>({
      path: `${searchProfile}`,
      data: offenderList,
    })
    return profileResults
  }

  async getPrisonerProfilesByIds(offenderList: string[]) {
    const searchProfile = `${BASE_URL}/search`

    const profileResults = await this.restClient.post<string[]>({
      path: `${searchProfile}`,
      data: offenderList,
    })
    return profileResults
  }

  async createProfile(newProfile: CreateProfileRequestArgs) {
    const result = await this.restClient.post<CreateProfileResponse>({
      path: `${BASE_URL}/${newProfile.prisonerId}`,
      data: new CreateProfileRequest(newProfile),
    })

    return result
  }

  async updateProfile(prisonerId: string, profile: UpdatePrisonerProfile) {
    const result = await this.restClient.put<CreateProfileResponse>({
      path: `${BASE_URL}/${prisonerId}`,
      data: profile,
    })

    return result
  }

  async getNotes(prisonerId: string, attribute: string) {
    const result = await this.restClient.get<Note[]>({
      path: `${BASE_URL}/${prisonerId}/notes/${attribute}`,
    })

    return result
  }

  async createNote(prisonerId: string, attribute: string, text: string) {
    const result = await this.restClient.post<Note[]>({
      path: `${BASE_URL}/${prisonerId}/notes/${attribute}`,
      data: text,
    })

    return result
  }
}
