import config from '../../config'
import logger from '../../log'
import RestClient from '../restClient'
import { UserDetails } from '../../services/userService'
import PagedResponse from '../domain/types/pagedResponse'
import AuthRole from '../../middleware/authorisationMiddleware'

interface UserCaseLoad {
  caseloads: [
    {
      id: string
      name: string
    },
  ]
}

interface Role {
  roleCode: string
}

export interface Prison {
  agencyId: string
  description: string
  agencyType: string
  active: boolean
}

export default class NomisUserRolesApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Nomis User Roles API', config.apis.nomisUserRolesApi, token)
  }

  async getUserCaseLoads(user: UserDetails): Promise<string[]> {
    return this.restClient
      .get<UserCaseLoad>({ path: `/users/${user}/caseloads` })
      .then(userCaseload => userCaseload.caseloads.map(caseload => caseload.id))
  }

  async getUserRoles(username: string): Promise<string[]> {
    return this.restClient
      .get<Role[]>({ path: `/users/${username}/roles` })
      .then(roles => roles.map(role => `ROLE_${role.roleCode}`))
  }
}
