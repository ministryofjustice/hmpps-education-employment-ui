import ApplicationStatusValue from '../../enums/applicationStatusValue'

interface ApplicationSearchResults {
  prisonId: string
  jobId: number
  jobTitle: string
  employerName: string
  prisonerNumber: string
  firstName: string
  lastName: string
  applicationStatus: ApplicationStatusValue
}

export default ApplicationSearchResults
