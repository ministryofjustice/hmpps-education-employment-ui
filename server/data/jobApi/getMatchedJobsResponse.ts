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
  isNational: boolean // TODO: Check this is what will be returned from the API
}

export default GetMatchedJobsResponse
