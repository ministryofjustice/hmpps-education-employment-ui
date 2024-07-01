import ApplicationStatusValue from '../../enums/applicationStatusValue'

interface UpdateApplicationProgressData {
  jobId: number
  prisonId: string
  offenderNo: string
  firstName: string
  lastName: string
  applicationStatus: ApplicationStatusValue
  additionalInformation: string
}

export default UpdateApplicationProgressData
