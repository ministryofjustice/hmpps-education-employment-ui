import HmppsAuthClient from '../data/hmppsAuthClient'
import { CreateProfileRequestArgs } from '../data/prisonerProfile/createProfileRequest'
import CreateProfileResponse from '../data/prisonerProfile/createProfileResponse'
import GetProfileByIdResult from '../data/prisonerProfile/getProfileByIdResult'
import PrisonerProfileClient from '../data/prisonerProfile/prisonerProfileClient'

export default class PrisonerProfileService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getProfileById(userToken: string, id: string): Promise<GetProfileByIdResult> {
    return new PrisonerProfileClient(userToken).getProfileById(id)
  }

  async createProfile(userToken: string, newProfile: CreateProfileRequestArgs): Promise<CreateProfileResponse> {
    return new PrisonerProfileClient(userToken).createProfile(newProfile)
  }
}
