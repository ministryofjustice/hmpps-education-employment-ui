import ApplicationStatusValue from '../../enums/applicationStatusValue'

interface ApplicationSearchResults {
  content: {
    prisonId: string
    jobId: number
    jobTitle: string
    employerName: string
    prisonerNumber: string
    firstName: string
    lastName: string
    applicationStatus: ApplicationStatusValue
  }[]
  totalElements: number
}

export default ApplicationSearchResults
