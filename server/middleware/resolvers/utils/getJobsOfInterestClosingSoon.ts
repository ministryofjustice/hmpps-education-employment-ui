import JobService from '../../../services/jobService'

const getJobsOfInterestClosingSoon = async (jobService: JobService, username: string, offenderNo: string) => {
  try {
    // Get interested jobs
    return await jobService.getJobsOfInterestClosingSoon(username, offenderNo)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getJobsOfInterestClosingSoon
