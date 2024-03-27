interface GetMatchedJobsResponse {
  content: {
    employerName: string
    jobTitle: string
    closingDate: string
  }[]
}

export default GetMatchedJobsResponse
