import GetMatchedJobsClosingSoonResponse from '../../../data/jobApi/getMatchedJobsClosingSoonResponse'
import TypeOfWorkValue from '../../../enums/typeOfWorkValue'
import JobService from '../../../services/jobService'

const getMatchedJobsClosingSoon = async (
  jobService: JobService,
  username: string,
  params: { offenderNo: string; count?: number; jobSectorFilter: TypeOfWorkValue[] },
) => {
  try {
    // Get interested jobs
    return await jobService.getMatchedJobsClosingSoon(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404 || err?.status === 500) {
      return {
        content: [] as GetMatchedJobsClosingSoonResponse[],
        page: {
          size: 0,
          number: 0,
          totalElements: 0,
          totalPages: 0,
        },
      }
    }

    throw err
  }
}

export default getMatchedJobsClosingSoon
