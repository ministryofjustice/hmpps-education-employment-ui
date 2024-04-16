import JobService from '../../../services/jobService'

const getFlaggedJobs = async (
  jobService: JobService,
  username: string,
  params: {
    offenderNo: string
    page?: number
    sort?: string
    order?: string
    typeOfWorkFilter?: string
    locationFilter?: string
    distanceFilter?: string
  },
) => {
  try {
    // Get Flagged jobs
    return await jobService.getFlaggedJobs(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getFlaggedJobs
