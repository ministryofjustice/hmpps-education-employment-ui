import JobService from '../../../services/jobService'

const getMatchedJobs = async (
  jobService: JobService,
  username: string,
  params: {
    offenderNo: string
    page?: number
    sort?: string
    order?: string
    typeOfWorkFilter?: string
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
      return undefined
    }

    throw err
  }
}

export default getMatchedJobs
