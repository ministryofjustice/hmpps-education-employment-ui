import JobService from '../../../services/jobService'

const getJobDetails = async (jobService: JobService, username: string, jobId: string) => {
  try {
    // Get complete job details
    return await jobService.getJobDetails(username, jobId)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getJobDetails
