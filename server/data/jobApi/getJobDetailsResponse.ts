import ContractType from '../../enums/contractType'
import ExcludingOffences from '../../enums/excludingOffences'
import Hours from '../../enums/hours'
import SalaryPeriod from '../../enums/salaryPeriod'
import TypeOfWorkValue from '../../enums/typeOfWorkValue'
import WorkBaseLocation from '../../enums/workBaseLocation'
import WorkPattern from '../../enums/workPattern'

interface GetJobDetailsResponse {
  id: number
  employerId: string
  employerName?: string
  jobTitle: string
  sector: TypeOfWorkValue
  numberOfVacancies: number
  charityName?: string
  postcode: string
  salaryFrom: number
  salaryTo?: number
  salaryPeriod: SalaryPeriod
  additionalSalaryInformation?: string
  isPayingAtLeastNationalMinimumWage: boolean
  workPattern: WorkPattern
  contractType: ContractType
  hoursPerWeek: Hours
  baseLocation?: WorkBaseLocation
  essentialCriteria: string
  desirableCriteria?: string
  description: string
  offenceExclusions: ExcludingOffences[]
  howToApply: string
  closingDate: string
  startDate?: string
  isRollingOpportunity: boolean
  isOnlyForPrisonLeavers: boolean
  archived: boolean
  expressionOfInterest: boolean
}

export default GetJobDetailsResponse
