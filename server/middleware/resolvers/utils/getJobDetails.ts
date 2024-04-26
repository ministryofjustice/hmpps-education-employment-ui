import JobService from '../../../services/jobService'

const getJobDetails = async (
  jobService: JobService,
  username: string,
  params: {
    employerName: string
    jobTitle?: string
    city?: string
  },
) => {
  try {
    // Get complete job details
    return await jobService.getCompleteJobDetails(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getJobDetails
