import DeliusIntegrationService from '../../../services/deliusIntegrationService'

const getPrisonerAddressById = async (
  deliusIntegrationService: DeliusIntegrationService,
  username: string,
  id: string,
) => {
  try {
    // Get Prisoner address
    return await deliusIntegrationService.getAddressForOffender(username, id)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return undefined
    }

    throw err
  }
}

export default getPrisonerAddressById
