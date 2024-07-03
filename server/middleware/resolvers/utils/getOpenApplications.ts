import JobApplicationService from '../../../services/jobApplicationService'

const getOpenApplications = async (jobApplicationService: JobApplicationService, username: string, id: string) => {
  try {
    // Get Closed applications
    return await jobApplicationService.getOpenApplications(username, id)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getOpenApplications
