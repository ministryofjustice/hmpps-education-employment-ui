import KeyworkerService from '../../../services/keyworkerService'

// Gets keyworker based on id
const getKeyworkerById = async (keyworkerService: KeyworkerService, username: string, id: string) => {
  // Get keyworker
  return keyworkerService.getKeyworkerForOffender(username, id)
}

export default getKeyworkerById
