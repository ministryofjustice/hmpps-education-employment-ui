export interface CreateProfileRequestArgs {
  prisonerId: string
  bookingId: number
  status: ProfileStatus
}

interface CreateProfileRequestProfileSection {
  status: ProfileStatus
}

export class CreateProfileRequest {
  constructor(data: CreateProfileRequestArgs) {
    this.bookingId = data.bookingId
    this.profileData = {
      status: data.status,
    }
  }

  bookingId: number

  profileData: CreateProfileRequestProfileSection
}

export enum ProfileStatus {
  NO_RIGHT_TO_WORK = 'NO_RIGHT_TO_WORK',
  SUPPORT_DECLINED = 'SUPPORT_DECLINED',
  SUPPORT_NEEDED = 'SUPPORT_NEEDED',
  READY_TO_WORK = 'READY_TO_WORK',
}
