import EmployerSector from '../../enums/employerSector'
import EmployerStatus from '../../enums/employerStatus'

interface GetEmployerResponse {
  id: string
  name: string
  description: string
  sector: EmployerSector
  status: EmployerStatus
  createdAt: string
  createdBy: string
}

export default GetEmployerResponse
