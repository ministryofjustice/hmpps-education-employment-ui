import GetOtherJobsOfInterestResponse from '../../../data/jobApi/getOtherJobsOfInterestResponse'
import JobService from '../../../services/jobService'

const getJobsOfInterest = async (
  jobService: JobService,
  username: string,
  params: {
    offenderNo: string
    page?: number
    sort?: string
    order?: string
    locationFilter?: string
  },
) => {
  try {
    // Get interested jobs
    return await jobService.getJobsOfInterest(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404 || err?.status === 500) {
      return {
        content: [] as GetOtherJobsOfInterestResponse[],
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

export default getJobsOfInterest
