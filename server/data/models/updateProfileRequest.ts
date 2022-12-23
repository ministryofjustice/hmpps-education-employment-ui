import ProfileDataSection from '../prisonerProfile/interfaces/profileDataSection'
import PrisonerProfile from '../prisonerProfile/interfaces/prisonerProfile'

// Standard model for updating profile without logic
export default class UpdateProfileRequest {
  constructor(profile: PrisonerProfile) {
    this.bookingId = profile.bookingId
    this.profileData = profile.profileData
  }

  bookingId: number

  profileData: ProfileDataSection
}
