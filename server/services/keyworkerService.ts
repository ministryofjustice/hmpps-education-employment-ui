import HmppsAuthClient from '../data/hmppsAuthClient'
import KeyworkerApiClient from '../data/keyworkerApi/keyworkerApiClient'
import convertToTitleCase from '../utils/convertToTitleCase'

export default class KeyworkerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getKeyworkerForOffender(
    username: string,
    id: string,
  ): Promise<{ firstName: string; lastName: string; email: string }> {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    const staffAllocationsResult = await new KeyworkerApiClient(systemToken).getStaffAllocationsForOffender(id)

    const keyWorkerAllocation = staffAllocationsResult?.allocations.find(a => a.policy.code === 'KEY_WORKER')

    // Handle case where no key worker is allocated
    const keyWorkerFirstName = keyWorkerAllocation?.staffMember?.firstName
    const keyWorkerLastName = keyWorkerAllocation?.staffMember?.lastName
    if (!keyWorkerFirstName || !keyWorkerLastName) {
      return undefined
    }
    return {
      firstName: convertToTitleCase(keyWorkerFirstName),
      lastName: convertToTitleCase(keyWorkerLastName),
      email: keyWorkerAllocation?.staffMember?.emailAddresses[0],
    }
  }
}
