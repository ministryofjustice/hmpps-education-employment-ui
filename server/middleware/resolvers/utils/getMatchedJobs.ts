import JobService from '../../../services/jobService'

const getMatchedJobs = async (jobService: JobService, username: string, id: string) => {
  try {
    // Get matched jobs
    return await jobService.getMatchedJobs(username, id)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getMatchedJobs
