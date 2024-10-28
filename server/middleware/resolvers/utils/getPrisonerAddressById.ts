import DeliusIntegrationService from '../../../services/deliusIntegrationService'
import config from '../../../config'
import logger from '../../../../logger'
import getRandomPostcode from '../../../utils/getRandomPostcode'

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
      // DEVELOPMENT ENV ONLY - If enabled use random postcode test data
      if (config.phaseName === 'DEV' && config.featureToggles.randomPostcodesInDevEnabled) {
        logger.info('DEVELOPMENT - Random postcode test data enabled')
        return { postcode: getRandomPostcode() }
      }
      return undefined
    }

    throw err
  }
}

export default getPrisonerAddressById
