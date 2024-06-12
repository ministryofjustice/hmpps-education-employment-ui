interface ApplicationSearchResults {
  content: {
    prisonId: string
    jobId: number
    jobTitle: string
    employerName: string
    prisonerNumber: string
    firstName: string
    lastName: string
    applicationStatus: string
  }[]
  totalElements: number
}

export default ApplicationSearchResults
