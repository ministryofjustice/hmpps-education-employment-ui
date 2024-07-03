import TypeOfWorkValue from '../../enums/typeOfWorkValue'

interface GetOtherJobsOfInterestResponse {
  employerName: string
  jobTitle: string
  closingDate: string
  distance: number
  city: string
  postcode: string
  typeOfWork: TypeOfWorkValue
}

export default GetOtherJobsOfInterestResponse
