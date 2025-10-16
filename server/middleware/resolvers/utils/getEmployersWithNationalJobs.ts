import JobService from '../../../services/jobService'

const getEmployersWithNationalJobs = async (jobService: JobService, username: string) => {
  try {
    // Get employer
    return await jobService.getEmployersWithNationalJobs(username)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getEmployersWithNationalJobs
