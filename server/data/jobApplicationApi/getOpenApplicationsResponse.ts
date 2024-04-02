interface GetOpenApplicationsResponse {
  content: {
    applicationId: number
    employerName: string
    jobTitle: string
    applicationStatus: string
  }[]
}

export default GetOpenApplicationsResponse
