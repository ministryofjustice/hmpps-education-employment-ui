import ApplicationStatusValue from '../../enums/applicationStatusValue'

interface GetApplicationProgressResponse {
  id: string
  status: ApplicationStatusValue
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  additionalInformation: string
}

export default GetApplicationProgressResponse
