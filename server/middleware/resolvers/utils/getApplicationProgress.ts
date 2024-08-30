import GetApplicationProgressResponse from '../../../data/jobApplicationApi/getApplicationProgressResponse'
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
    if (err?.status === 404 || err?.status === 500) {
      return {
        content: [] as GetApplicationProgressResponse[],
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

export default getApplicationProgress
