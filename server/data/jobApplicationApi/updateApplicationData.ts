import ApplicationStatusValue from '../../enums/applicationStatusValue'

interface UpdateApplicationProgressData {
  jobId: string
  prisonId: string
  prisonNumber: string
  firstName: string
  lastName: string
  applicationStatus: ApplicationStatusValue
  additionalInformation: string
}

export default UpdateApplicationProgressData
