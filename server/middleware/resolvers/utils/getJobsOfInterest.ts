import JobService from '../../../services/jobService'

const getJobsOfInterest = async (
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
    // Get interested jobs
    return await jobService.getJobsOfInterest(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getJobsOfInterest
