import HmppsAuthClient from '../data/hmppsAuthClient'
import { CreateProfileRequestArgs } from '../data/prisonerSearch/createProfileRequest'
import CreateProfileResponse from '../data/prisonerSearch/createProfileResponse'
import PrisonerProfileClient from '../data/prisonerSearch/prisonerProfileClient'

export default class PrisonerProfileService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async createProfile(userToken: string, newProfile: CreateProfileRequestArgs): Promise<CreateProfileResponse> {
    return new PrisonerProfileClient(userToken).createProfile(newProfile)
  }
}
