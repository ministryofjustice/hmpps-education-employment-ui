import JobApplicationService from '../../../services/jobApplicationService'

const getClosedApplications = async (jobApplicationService: JobApplicationService, username: string, id: string) => {
  try {
    // Get Closed applications
    return await jobApplicationService.getClosedApplications(username, id)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getClosedApplications
