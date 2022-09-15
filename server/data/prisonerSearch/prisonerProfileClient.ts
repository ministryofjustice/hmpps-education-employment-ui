import { plainToClass } from 'class-transformer'
import config from '../../config'
import RestClient from '../restClient'
import PagedResponse from '../domain/types/pagedResponse'
import PrisonerProfileResult from './prisonerProfileResult'

const PRISONER_EDUCATION_PROFILE_PATH = '/readiness-profiles/search'

export default class PrisonerProfileClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Prisoner Profile Search', config.apis.esweProfileApi, token)
  }

  async profileData(offenderList: string[]) {
    const searchProfile = PRISONER_EDUCATION_PROFILE_PATH
    const profileResults = await this.restClient.post<PagedResponse<PrisonerProfileResult>>({
      path: `${searchProfile}`,
      data: {
        offenderList,
      },
    })
    return profileResults
  }

  /*
    TODO: remove - mock eswe profile data
   */
  async mockProfileData(offenderList: string[]) {
    const esweProfile = {
      offenderId: 'A5089DY',
      bookingId: 123456,
      createdBy: 'sacintha-raj',
      createdDateTime: '2022-09-14T09:14:31.440479',
      modifiedBy: 'sacintha-raj',
      modifiedDateTime: '2022-09-14T09:14:31.440479',
      schemaVersion: '1.0.0',
      profileData: {
        status: 'SUPPORT_NEEDED',
        supportDeclined: 'null',
        supportAccepted: {
          actionsRequired: {
            modifiedBy: 'whilesp',
            modifiedDateTime: '2022-07-06T12:00:00',
            actions: [
              {
                todoItem: 'DISCLOSURE_LETTER',
                status: 'NOT_STARTED',
              },
              {
                todoItem: 'ID',
                status: 'NOT_STARTED',
              },
              {
                todoItem: 'BANK_ACCOUNT',
                status: 'COMPLETED',
              },
            ],
          },
          workImpacts: {
            modifiedBy: 'whilesp',
            modifiedDateTime: '2022-07-06T12:00:00',
            abilityToWorkImpactedBy: ['CARING_RESPONSIBILITIES'],
            caringResponsibilitiesFullTime: false,
            ableToManageMentalHealth: true,
            ableToManageDependencies: true,
          },
          workInterests: {
            modifiedBy: 'whilesp',
            modifiedDateTime: '2022-07-06T12:00:00',
            workTypesOfInterest: ['CONSTRUCTION', 'DRIVING', 'OTHER'],
            workTypesOfInterestOther: 'Goose juggler',
            jobOfParticularInterest: 'Goose juggler',
          },
          workExperience: {
            modifiedBy: 'whilesp',
            modifiedDateTime: '2022-07-06T12:00:00',
            previousWorkOrVolunteering: 'Goose herder',
            qualificationsAndTraining: ['DRIVING_LICENSE', 'FIRST_AID', 'FOOD_HYGIENE', 'OTHER'],
            qualificationsAndTrainingOther: 'Worked on a farm',
          },
        },
      },
    }
    return esweProfile
  }
}
