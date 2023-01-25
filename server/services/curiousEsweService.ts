import config from '../config'

import { HmppsAuthClient } from '../data'
import clientFactory from '../api/oauthEnabledClient'
import CuriousApi from '../api/curious/curiousApi'
import {
  LearnerLatestAssessment,
  LearnerNeurodivergence,
  LearnerEmployabilitySkills,
  LearnerEducation,
} from '../api/curious/types/Types'
import log from '../log'

const curiousApi = CuriousApi.create(clientFactory({ baseUrl: config.apis.curiousApi.url }))

export default class CuriousEsweService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getLearnerNeurodivergence(nomisId: string): Promise<LearnerNeurodivergence[]> {
    try {
      const systemToken = {
        access_token: await this.hmppsAuthClient.getSystemClientToken(config.apis.hmppsAuth.systemClientId),
        refresh_token: '',
      }

      const neurodivergence = await curiousApi.getLearnerNeurodivergence(systemToken, nomisId)
      return neurodivergence
    } catch (e) {
      if (e.status === 404) {
        log.info(`There is no neurodivergence data for this prisoner: ${nomisId.toUpperCase()}`)
        return []
      }
      log.error(`Failed to get neurodivergence details. Reason: ${e.message}`)
    }
    return null
  }

  async getLearnerEmployabilitySkills(nomisId: string): Promise<LearnerEmployabilitySkills> {
    try {
      const systemToken = {
        access_token: await this.hmppsAuthClient.getSystemClientToken(config.apis.hmppsAuth.systemClientId),
        refresh_token: '',
      }
      return await curiousApi.getLearnerEmployabilitySkillsRaw(systemToken, nomisId)
    } catch (e) {
      if (e.status === 404) {
        log.info(`There is no employability skills data for this prisoner: ${nomisId}`)
        return {}
      }
      log.error(`Failed to get learner employability skills. Reason: ${e.message}`)
    }
    return null
  }

  async getLearnerLatestAssessment(nomisId: string): Promise<LearnerLatestAssessment[]> {
    try {
      const systemToken = {
        access_token: await this.hmppsAuthClient.getSystemClientToken(config.apis.hmppsAuth.systemClientId),
        refresh_token: '',
      }

      return await curiousApi.getLearnerLatestAssessments(systemToken, nomisId)
    } catch (e) {
      if (e.status === 404) {
        log.info(`There is no assessment data for this prisoner: ${nomisId.toUpperCase()}`)
        return []
      }
      log.error(`Failed in get learner latest assessment. Reason: ${e.message}`)
    }
    return null
  }

  async getLearnerEducation(nomisId: string, isCurrent?: boolean, establishmentId?: string): Promise<LearnerEducation> {
    try {
      const systemToken = {
        access_token: await this.hmppsAuthClient.getSystemClientToken(config.apis.hmppsAuth.systemClientId),
        refresh_token: '',
      }

      return await curiousApi.getLearnerEducationRaw(systemToken, nomisId, isCurrent, establishmentId)
    } catch (e) {
      if (e.status === 404) {
        log.info(`There is no education data for this prisoner: ${nomisId.toUpperCase()}`)
        return {}
      }
      log.error(`Failed to get learner education data. Reason: ${e.message}`)
    }
    return null
  }
}
