import JobService from '../../../services/jobService'

const getFlaggedJobs = async (jobService: JobService, username: string, id: string) => {
  try {
    // Get Flagged jobs
    return await jobService.getFlaggedJobs(username, id)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getFlaggedJobs
