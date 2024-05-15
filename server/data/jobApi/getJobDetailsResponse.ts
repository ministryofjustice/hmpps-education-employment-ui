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
  typeOfWork: TypeOfWorkValue
  workPatternName: string
  salaryFrom: string
  salaryTo: number
  additionalSalaryInformation: string
  salaryPeriod: SalaryPeriod
  offenceExclusions: ExcludingOffences[]
  essentialCriteria: string
  desirableCriteria: string
  jobDescription: string
  workPattern: ContractType
}

export default GetJobDetailsResponse
