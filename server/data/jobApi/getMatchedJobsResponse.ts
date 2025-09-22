import TypeOfWorkValue from '../../enums/typeOfWorkValue'

interface GetMatchedJobsResponse {
  id: string
  employerName: string
  jobTitle: string
  closingDate: string
  distance?: number
  postcode?: string
  sector: TypeOfWorkValue
  hasExpressedInterest: boolean
  isNational: boolean
  vacancies?: number
}

export default GetMatchedJobsResponse
