import { convertToTitleCase } from '../utils/index'
import type HmppsAuthClient from '../data/hmppsAuthClient'
import ManageUsersApiClient from '../data/manageUsersApi/manageUsersApiClient'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'
import UserDetails from '../data/manageUsersApi/userDetails'

export default class UserService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getUser(token: string): Promise<UserDetails> {
    const user = await new ManageUsersApiClient().getUser(token)
    return { ...user, displayName: convertToTitleCase(user.name), username: user.name }
  }

  async getUserByUsername(currentUserName: string, username: string): Promise<UserDetails> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(currentUserName)

    const user = await new ManageUsersApiClient().getUserByUsername(systemToken, username)
    return { ...user, displayName: convertToTitleCase(user.name), username: user.name }
  }

  async getDpsUserRoles(username: string): Promise<string[]> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)
    const roles = await new NomisUserRolesApiClient(systemToken).getDpsUserRoles(username)

    return roles
  }
}
