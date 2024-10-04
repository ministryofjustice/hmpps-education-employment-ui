import TypeOfWorkValue from '../../enums/typeOfWorkValue'

interface GetMatchedJobsResponse {
  id: string
  employerName: string
  jobTitle: string
  closingDate: string
  distance: number
  city: string
  postcode: string
  sector: TypeOfWorkValue
  hasExpressedInterest: boolean
}

export default GetMatchedJobsResponse
