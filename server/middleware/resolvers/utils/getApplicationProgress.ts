import JobService from '../../../services/jobService'

const getApplicationProgress = async (jobService: JobService, username: string, offenderNo: string, jobId: string) => {
  try {
    // Get complete job details
    return await jobService.getApplicationProgress(username, offenderNo, jobId)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getApplicationProgress
