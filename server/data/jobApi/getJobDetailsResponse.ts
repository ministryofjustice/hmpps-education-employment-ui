interface GetJobDetailsResponse {
  employerName: string
  jobTitle: string
  closingDate: string
  distance: number
  city: string
  postcode: string
  typeOfWork: string
  workPatternName: string
  salary: string
  offenceExclusions: string[]
  essentialCriteria: string[]
  desirableCriteria: string[]
  jobDescription: string
  workPattern: string
  salaryPeriod: string
  additionalSalaryInformation: string
}

export default GetJobDetailsResponse
