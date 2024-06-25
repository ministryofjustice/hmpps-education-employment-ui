import HmppsAuthClient from '../data/hmppsAuthClient'
import CreateProfileResponse from '../data/prisonerProfile/createProfileResponse'
import GetProfileByIdResult from '../data/prisonerProfile/getProfileByIdResult'
import CreateProfileRequestArgs from '../data/prisonerProfile/interfaces/createProfileRequestArgs'
import Note from '../data/prisonerProfile/interfaces/note'
import UpdatePrisonerProfile from '../data/prisonerProfile/interfaces/updatePrisonerProfile'
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
    prisonerId: string,
    profile: UpdatePrisonerProfile,
  ): Promise<CreateProfileResponse> {
    return new PrisonerProfileClient(userToken).updateProfile(prisonerId, profile)
  }

  async getNotes(userToken: string, prisonerId: string, attribute: string): Promise<Note[]> {
    return new PrisonerProfileClient(userToken).getNotes(prisonerId, attribute.toUpperCase())
  }

  async createNote(userToken: string, prisonerId: string, attribute: string, text: string): Promise<Note[]> {
    return new PrisonerProfileClient(userToken).createNote(prisonerId, attribute.toUpperCase(), text)
  }
}
