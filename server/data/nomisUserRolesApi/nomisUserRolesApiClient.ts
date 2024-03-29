/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config'
import UserDetails from '../manageUsersApi/userDetails'
import RestClient from '../restClient'
import GetStaffDetailsResponse from './getStaffDetailsResponse'

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

interface DpsRole {
  dpsRoles: [
    {
      code: string
      name: string
      sequence: number
      type: string
      adminRoleOnly: boolean
    },
  ]
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

  async getDpsUserRoles(username: string): Promise<string[]> {
    return this.restClient
      .get<DpsRole>({ path: `/users/${username}/roles` })
      .then(roles => roles.dpsRoles.map(role => role.code))
  }

  async getUserActiveCaseLoad(): Promise<any> {
    return this.restClient.get<any>({ path: `/me/caseloads` })
  }

  async getStaffDetails(staffId: number): Promise<GetStaffDetailsResponse> {
    return this.restClient.get<GetStaffDetailsResponse>({ path: `/users/staff/${staffId}` })
  }
}
