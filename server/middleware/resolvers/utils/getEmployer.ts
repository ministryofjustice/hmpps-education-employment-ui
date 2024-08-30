import JobService from '../../../services/jobService'

const getEmployer = async (jobService: JobService, username: string, employerId: string) => {
  try {
    // Get employer
    return await jobService.getEmployer(username, employerId)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getEmployer
