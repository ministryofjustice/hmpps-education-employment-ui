import { Readable } from 'stream'
import fs from 'fs'

import superagent from 'superagent'
import path from 'path'
import config from '../../config'
import logger from '../../log'
import RestClient from '../restClient'
import GetOffenderActivitiesResponse from './getOffenderActivitiesResponse'

export interface Prison {
  agencyId: string
  description: string
  agencyType?: string
  active?: boolean
}

export interface PrisonerMovement {
  fromAgency: string
  fromAgencyDescription: string
  fromCity: string
  directionCode: string
  movementDate: string
  movementReason: string
  movementType: string
  movementTypeDescription: string
  toAgency: string
  toAgencyDescription: string
  toCity: string
}

export default class PrisonApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Prison API', config.apis.hmppsPrisonApi, token)
  }

  async getPrisonerImage(prisonerNumber: string): Promise<Readable> {
    try {
      const imageResponse = await this.restClient.get<Buffer>({
        path: `/api/bookings/offenderNo/${prisonerNumber}/image/data`,
      })

      const stream = new Readable()
      stream.push(imageResponse)
      stream.push(null)
      return stream
    } catch (error) {
      logger.info(`No prisoner image available for prisonerNumber: ${prisonerNumber}`)

      const file = `${path.resolve('./')}/assets/images/image-missing.jpg`
      const filestream: Readable = fs.createReadStream(file)

      return filestream
    }
  }

  async getLastMovement(prisonerNumber: string): Promise<PrisonerMovement[]> {
    return this.restClient.post({
      path: `/api/movements/offenders?latestOnly=true&movementTypes=REL&movementTypes=TRN`,
      data: [prisonerNumber],
    })
  }

  getPrisons(): Promise<Prison[]> {
    return this.restClient.get<Prison[]>({
      path: `/api/agencies/type/INST`,
    })
  }

  async getPrison(prisonId: string): Promise<Prison> {
    return this.restClient.get<Prison>({
      path: `/api/agencies/${prisonId}`,
    })
  }

  async getAllOffenderActivities(offenderId: string): Promise<GetOffenderActivitiesResponse> {
    return this.restClient.get<GetOffenderActivitiesResponse>({
      path: `/api/offender-activities/${offenderId}/activities-history?earliestEndDate=1922-10-01&page=0&size=9999`,
    })
  }
}
