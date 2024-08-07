import TypeOfWorkValue from '../../enums/typeOfWorkValue'

interface GetArchivedJobsResponse {
  employerName: string
  jobTitle: string
  closingDate: string
  distance: number
  city: string
  postcode: string
  typeOfWork: TypeOfWorkValue
}

export default GetArchivedJobsResponse
