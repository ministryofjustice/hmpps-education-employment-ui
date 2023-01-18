import HmppsAuthClient from '../data/hmppsAuthClient'
import CreateProfileResponse from '../data/prisonerProfile/createProfileResponse'
import GetProfileByIdResult from '../data/prisonerProfile/getProfileByIdResult'
import CreateProfileRequestArgs from '../data/prisonerProfile/interfaces/createProfileRequestArgs'
import PrisonerProfile from '../data/prisonerProfile/interfaces/prisonerProfile'
import PrisonerProfileClient from '../data/prisonerProfile/prisonerProfileClient'

export default class PrisonerProfileService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getProfileById(userToken: string, id: string): Promise<GetProfileByIdResult> {
    return new PrisonerProfileClient(userToken).getProfileById(id)
  }

  async createProfile(userToken: string, newProfile: CreateProfileRequestArgs): Promise<CreateProfileResponse> {
    return new PrisonerProfileClient(userToken).createProfile(newProfile)
  }

  async updateProfile(
    userToken: string,
    newProfile: CreateProfileRequestArgs,
    existingProfile: PrisonerProfile,
  ): Promise<CreateProfileResponse> {
    return new PrisonerProfileClient(userToken).updateProfile(newProfile, existingProfile)
  }
}
