import JobApplicationService from '../../../services/jobApplicationService'

const getApplicationProgress = async (
  jobApplicationService: JobApplicationService,
  username: string,
  offenderNo: string,
  jobId: string,
) => {
  try {
    // Get complete job details
    return await jobApplicationService.getApplicationProgress(username, offenderNo, jobId)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getApplicationProgress
