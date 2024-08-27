import GetJobsOfInterestClosingSoonResponse from '../../../data/jobApi/getJobOfInterestClosingSoonResponse'
import JobService from '../../../services/jobService'

const getJobsOfInterestClosingSoon = async (jobService: JobService, username: string, offenderNo: string) => {
  try {
    // Get interested jobs
    return await jobService.getJobsOfInterestClosingSoon(username, offenderNo)
  } catch (err) {
    // Handle no data
    if (err?.status === 404 || err?.status === 500) {
      return {
        content: [] as GetJobsOfInterestClosingSoonResponse[],
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

export default getJobsOfInterestClosingSoon
