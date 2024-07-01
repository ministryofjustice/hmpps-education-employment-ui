import ApplicationStatusValue from '../../enums/applicationStatusValue'

interface GetApplicationProgressResponse {
  status: ApplicationStatusValue
  createdByName: string
  createdByDateTime: string
  additionalInformation: string
}

export default GetApplicationProgressResponse
