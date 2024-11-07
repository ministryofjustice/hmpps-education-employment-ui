import GetArchivedJobsResponse from '../../../data/jobApi/geArchivedJobsResponse'
import JobService from '../../../services/jobService'

const getArchivedJobs = async (
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
    // Get Archived jobs
    return await jobService.getArchivedJobs(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404 || err?.status === 500) {
      return {
        content: [] as GetArchivedJobsResponse[],
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

export default getArchivedJobs
