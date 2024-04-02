interface GetFlaggedJobsResponse {
  content: {
    employerName: string
    jobTitle: string
    closingDate: string
  }[]
}

export default GetFlaggedJobsResponse
