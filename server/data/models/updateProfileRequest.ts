import ProfileDataSection from '../prisonerProfile/interfaces/profileDataSection'
import PrisonerProfile from '../prisonerProfile/interfaces/prisonerProfile'

// Standard model for updating profile without logic
export default class UpdateProfileRequest {
  constructor(profile: PrisonerProfile) {
    this.bookingId = profile.bookingId
    this.profileData = {
      status: profile.profileData.status,
      supportDeclined: profile.profileData.supportDeclined,
      supportAccepted: profile.profileData.supportAccepted,
    }
  }

  bookingId: number

  profileData: ProfileDataSection
}
