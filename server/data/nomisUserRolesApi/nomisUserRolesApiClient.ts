/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config'
import RestClient from '../restClient'
import { UserDetails } from '../../services/userService'

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

export default class NomisUserRolesApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Nomis User Roles API', config.apis.nomisUserRolesApi, token)
  }

  async getUserCaseLoads(user: UserDetails): Promise<string[]> {
    return this.restClient
      .get<UserCaseLoad>({ path: `/users/${user.username}/caseloads` })
      .then(userCaseload => userCaseload.caseloads.map(caseload => caseload.id))
  }

  async getUserRoles(username: string): Promise<string[]> {
    return this.restClient
      .get<Role[]>({ path: `/users/${username}/roles` })
      .then(roles => roles.map(role => `ROLE_${role.roleCode}`))
  }

  async getUserActiveCaseLoad(user: UserDetails): Promise<any> {
    return this.restClient.get<any>({ path: `/users/${user.username}/caseloads` })
  }
}
