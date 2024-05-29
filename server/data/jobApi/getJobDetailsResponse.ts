import ContractType from '../../enums/contractType'
import ExcludingOffences from '../../enums/excludingOffences'
import Hours from '../../enums/hours'
import SalaryPeriod from '../../enums/salaryPeriod'
import TypeOfWorkValue from '../../enums/typeOfWorkValue'

interface GetJobDetailsResponse {
  id: number
  employerName: string
  jobTitle: string
  closingDate: string
  distance: number
  city: string
  postcode: string
  typeOfWork: TypeOfWorkValue
  salaryFrom: string
  salaryTo: number
  additionalSalaryInformation: string
  salaryPeriod: SalaryPeriod
  offenceExclusions: ExcludingOffences[]
  essentialCriteria: string
  desirableCriteria: string
  jobDescription: string
  workPattern: ContractType
  hours: Hours
  howToApply: string
}

export default GetJobDetailsResponse
