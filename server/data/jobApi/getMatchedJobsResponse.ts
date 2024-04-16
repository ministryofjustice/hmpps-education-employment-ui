interface GetMatchedJobsResponse {
  content: {
    employerName: string
    jobTitle: string
    closingDate: string
    distance: number
    city: string
    postcode: string
    typeOfWork: string
  }[]
}

export default GetMatchedJobsResponse
