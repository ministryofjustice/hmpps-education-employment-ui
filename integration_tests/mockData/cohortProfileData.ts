/* eslint-disable @typescript-eslint/no-explicit-any */
export function getTestCohortProfileData(): any {
  return [
    {
      offenderId: 'G6190UD',
      bookingId: 123456,
      createdBy: 'sacintha-raj',
      createdDateTime: '2022-10-20T09:24:58.903667',
      modifiedBy: 'sacintha-raj',
      modifiedDateTime: '2022-10-20T09:24:58.903672',
      schemaVersion: '1.0',
      profileData: {
        status: 'SUPPORT_NEEDED',
        supportDeclined: null,
        supportAccepted: {
          actionsRequired: {
            modifiedBy: 'whilesp',
            modifiedDateTime: '2022-07-06T12:00:00',
            actions: [
              {
                todoItem: 'BANK_ACCOUNT',
                status: 'COMPLETED',
              },
              {
                todoItem: 'DISCLOSURE_LETTER',
                status: 'NOT_STARTED',
              },
              {
                todoItem: 'ID',
                status: 'NOT_STARTED',
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
            workTypesOfInterest: ['CONSTRUCTION', 'OUTDOOR', 'RETAIL'],
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
    },
    {
      offenderId: 'A8291DY',
      bookingId: 123456,
      createdBy: 'sacintha-raj',
      createdDateTime: '2022-10-20T09:27:05.71569',
      modifiedBy: 'sacintha-raj',
      modifiedDateTime: '2022-10-20T09:27:05.715695',
      schemaVersion: '1.0',
      profileData: {
        status: 'SUPPORT_DECLINED',
        supportDeclined: {
          modifiedBy: 'me',
          modifiedDateTime: '2022-07-06T12:00:00',
          supportToWorkDeclinedReason: ['FULL_TIME_CARER'],
          supportToWorkDeclinedReasonOther: 'Wants to read the Beano',
          circumstanceChangesRequiredToWork: ['HOUSING_ON_RELEASE', 'OTHER'],
          circumstanceChangesRequiredToWorkOther: 'Will need socks',
        },
        supportAccepted: null,
      },
    },
    {
      offenderId: 'G5336UH',
      bookingId: 123456,
      createdBy: 'sacintha-raj',
      createdDateTime: '2022-10-20T10:54:38.579999',
      modifiedBy: 'sacintha-raj',
      modifiedDateTime: '2022-10-20T10:54:38.580005',
      schemaVersion: '1.0',
      profileData: {
        status: 'SUPPORT_DECLINED',
        supportDeclined: {
          modifiedBy: 'me',
          modifiedDateTime: '2022-07-06T12:00:00',
          supportToWorkDeclinedReason: ['RETIRED', 'RETURNING_TO_JOB'],
          supportToWorkDeclinedReasonOther: 'Wants to read the Beano',
          circumstanceChangesRequiredToWork: ['HOUSING_ON_RELEASE', 'OTHER'],
          circumstanceChangesRequiredToWorkOther: 'Will need socks',
        },
        supportAccepted: null,
      },
    },
    {
      offenderId: 'A7880DY',
      bookingId: 1201384,
      createdBy: 'USER1',
      createdDateTime: '2022-10-28T13:18:07.856849',
      modifiedBy: 'USER1',
      modifiedDateTime: '2022-10-28T13:18:07.856862',
      schemaVersion: '1.0',
      profileData: {
        status: 'NO_RIGHT_TO_WORK',
        supportDeclined: null,
        supportAccepted: null,
      },
    },
    {
      offenderId: 'A8036DY',
      bookingId: 1201576,
      createdBy: 'USER1',
      createdDateTime: '2022-10-28T13:51:14.357953',
      modifiedBy: 'USER1',
      modifiedDateTime: '2022-10-28T13:51:14.357964',
      schemaVersion: '1.0',
      profileData: {
        status: 'NO_RIGHT_TO_WORK',
        supportDeclined: null,
        supportAccepted: null,
      },
    },
    {
      offenderId: 'A8321DY',
      bookingId: 1201857,
      createdBy: 'USER1',
      createdDateTime: '2022-10-28T14:00:41.026489',
      modifiedBy: 'USER1',
      modifiedDateTime: '2022-10-28T14:00:41.026495',
      schemaVersion: '1.0',
      profileData: {
        status: 'NO_RIGHT_TO_WORK',
        supportDeclined: null,
        supportAccepted: null,
      },
    },
    {
      offenderId: 'G5492UQ',
      bookingId: 874591,
      createdBy: 'USER1',
      createdDateTime: '2022-11-07T09:45:17.481472',
      modifiedBy: 'USER1',
      modifiedDateTime: '2022-11-07T09:45:17.481482',
      schemaVersion: '1.0',
      profileData: {
        status: 'NO_RIGHT_TO_WORK',
        supportDeclined: null,
        supportAccepted: null,
      },
    },
  ]
}

export default { getTestCohortProfileData }
