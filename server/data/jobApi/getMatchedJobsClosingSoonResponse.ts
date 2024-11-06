import TypeOfWorkValue from '../../enums/typeOfWorkValue'

interface GetMatchedJobsClosingSoonResponse {
  id: number
  employerName: string
  jobTitle: string
  closingDate: string
  sector: TypeOfWorkValue
  createdAt: string
}

export default GetMatchedJobsClosingSoonResponse
