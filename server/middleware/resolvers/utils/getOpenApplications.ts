import GetOpenApplicationsResponse from '../../../data/jobApplicationApi/getOpenApplicationsResponse'
import JobApplicationService from '../../../services/jobApplicationService'

const getOpenApplications = async (jobApplicationService: JobApplicationService, username: string, id: string) => {
  try {
    // Get Closed applications
    return await jobApplicationService.getOpenApplications(username, id)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return {
        content: [] as GetOpenApplicationsResponse[],
        page: {
          size: 0,
          number: 0,
          totalElements: 0,
          totalPages: 0,
        },
      }
    }

    throw err
  }
}

export default getOpenApplications
