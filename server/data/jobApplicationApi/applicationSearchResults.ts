import ApplicationStatusValue from '../../enums/applicationStatusValue'

interface ApplicationSearchResults {
  prisonId: string
  jobId: string
  jobTitle: string
  employerName: string
  prisonNumber: string
  firstName: string
  lastName: string
  applicationStatus: ApplicationStatusValue
}

export default ApplicationSearchResults
