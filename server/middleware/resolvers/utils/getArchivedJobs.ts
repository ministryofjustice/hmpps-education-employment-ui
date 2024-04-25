import JobService from '../../../services/jobService'

const getArchivedJobs = async (
  jobService: JobService,
  username: string,
  params: {
    offenderNo: string
    page?: number
    sort?: string
    order?: string
  },
) => {
  try {
    // Get Archived jobs
    return await jobService.getArchivedJobs(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getArchivedJobs
