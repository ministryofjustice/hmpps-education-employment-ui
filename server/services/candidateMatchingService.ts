/* eslint-disable @typescript-eslint/no-explicit-any */
import HmppsAuthClient from '../data/hmppsAuthClient'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'

export default class CandidateMatchingService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getDpsUserRoles(username: string): Promise<any> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    const roles = await new NomisUserRolesApiClient(systemToken).getDpsUserRoles(username)

    return roles
  }
}
