import JobApplicationService from '../../../services/jobApplicationService'

const getPrisonerListApplications = async (
  jobApplicationService: JobApplicationService,
  username: string,
  params: {
    prisonId: string
    page?: number
    sort?: string
    order?: string
    applicationStatusFilter?: string
    prisonerNameFilter?: string
    jobFilter?: string
  },
) => {
  try {
    // Get Archived jobs
    return await jobApplicationService.applicationSearch(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getPrisonerListApplications
