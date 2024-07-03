import JobService from '../../../services/jobService'

const getMatchedJobsClosingSoon = async (
  jobService: JobService,
  username: string,
  params: { offenderNo: string; count?: number },
) => {
  try {
    // Get interested jobs
    return await jobService.getMatchedJobsClosingSoon(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getMatchedJobsClosingSoon
