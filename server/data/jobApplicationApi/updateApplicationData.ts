import ApplicationStatusValue from '../../enums/applicationStatusValue'

interface UpdateApplicationProgressData {
  applicationStatus: ApplicationStatusValue
  additionalInformation: string
}

export default UpdateApplicationProgressData
