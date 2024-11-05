import TypeOfWorkValue from '../../enums/typeOfWorkValue'

interface GetJobsOfInterestClosingSoonResponse {
  id: number
  employerName: string
  jobTitle: string
  closingDate: string
  sector: TypeOfWorkValue
  createdAt: string
}

export default GetJobsOfInterestClosingSoonResponse
