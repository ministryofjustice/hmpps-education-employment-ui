import GetMatchedJobsResponse from '../../../data/jobApi/getMatchedJobsResponse'
import JobService from '../../../services/jobService'

const getMatchedJobs = async (
  jobService: JobService,
  username: string,
  params: {
    offenderNo: string
    page?: number
    sort?: string
    order?: string
    jobSectorFilter?: string
    locationFilter?: string
    distanceFilter?: number
  },
) => {
  try {
    // Get matched jobs
    return await jobService.getMatchedJobs(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return {
        content: [] as GetMatchedJobsResponse[],
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

export default getMatchedJobs
