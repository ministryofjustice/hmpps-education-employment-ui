import DeliusIntegrationService from '../../../services/deliusIntegrationService'

const getComById = async (deliusIntegrationService: DeliusIntegrationService, username: string, id: string) => {
  try {
    // Get Com
    return await deliusIntegrationService.getComForOffender(username, id)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getComById
