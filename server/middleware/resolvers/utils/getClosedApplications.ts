import GetClosedApplicationsResponse from '../../../data/jobApplicationApi/getClosedApplicationsResponse'
import JobApplicationService from '../../../services/jobApplicationService'

const getClosedApplications = async (jobApplicationService: JobApplicationService, username: string, id: string) => {
  try {
    // Get Closed applications
    return await jobApplicationService.getClosedApplications(username, id)
  } catch (err) {
    // Handle no data
    if (err?.status === 404 || err?.status === 500) {
      return {
        content: [] as GetClosedApplicationsResponse[],
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

export default getClosedApplications
