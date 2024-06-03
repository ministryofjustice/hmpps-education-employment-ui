import ApplicationStatusValue from '../../enums/applicationStatusValue'

interface GetApplicationProgressResponse {
  status: ApplicationStatusValue
  createdByName: string
  createdByDateTime: string
  notes: string
}

export default GetApplicationProgressResponse
