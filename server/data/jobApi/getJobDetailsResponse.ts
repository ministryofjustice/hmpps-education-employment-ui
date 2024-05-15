import ContractType from '../../enums/contractType'
import ExcludingOffences from '../../enums/excludingOffences'
import SalaryPeriod from '../../enums/salaryPeriod'
import TypeOfWorkValue from '../../enums/typeOfWorkValue'

interface GetJobDetailsResponse {
  employerName: string
  jobTitle: string
  closingDate: string
  distance: number
  city: string
  postcode: string
  typeOfWork: string
  workPatternName: string
  salaryFrom: number
  salaryTo: number
  additionalSalaryInformation: string
  salaryPeriod: string
  offenceExclusions: string[]
  essentialCriteria: string
  desirableCriteria: string
  jobDescription: string
  workPattern: string
}

export default GetJobDetailsResponse
