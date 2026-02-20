const profiles = {
  A00001A: {
    request: {
      method: 'GET',
      urlPattern: '/readiness-profiles/A00001A',
    },
    response: {
      status: 400,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 400,
        userMessage: 'Readiness profile does not exist',
      },
    },
  },
  H4115SD: {
    request: {
      method: 'GET',
      urlPattern: '/readiness-profiles/H4115SD',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        offenderId: 'H4115SD',
        modifiedBy: 'USER1',
        modifiedDateTime: new Date().toISOString(),
        profileData: {
          status: 'SUPPORT_NEEDED',
          modifiedBy: 'USER1',
          modifiedDateTime: new Date().toISOString(),
          supportAccepted: {
            actionsRequired: {
              modifiedBy: 'USER1',
              modifiedDateTime: new Date().toISOString(),
              actions: [
                {
                  todoItem: 'BANK_ACCOUNT',
                  status: 'NOT_STARTED',
                },
                {
                  todoItem: 'CV_AND_COVERING_LETTER',
                  status: 'NOT_STARTED',
                },
                {
                  todoItem: 'DISCLOSURE_LETTER',
                  status: 'NOT_STARTED',
                },
                {
                  todoItem: 'EMAIL_OR_PHONE',
                  status: 'COMPLETED',
                },
                {
                  todoItem: 'HOUSING',
                  status: 'COMPLETED',
                },
                {
                  todoItem: 'ID',
                  status: 'COMPLETED',
                },
              ],
            },
          },
        },
      },
    },
  },
  G5005GD: {
    request: {
      method: 'GET',
      urlPattern: '/readiness-profiles/G5005GD',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        offenderId: 'G5005GD',
        modifiedBy: 'USER1',
        modifiedDateTime: new Date().toISOString(),
        profileData: {
          status: 'SUPPORT_DECLINED',
          modifiedBy: 'USER1',
          modifiedDateTime: new Date().toISOString(),
          supportDeclined: {
            modifiedBy: 'USER1',
            modifiedDateTime: new Date().toISOString(),
            supportToWorkDeclinedReason: ['LIMIT_THEIR_ABILITY', 'FULL_TIME_CARER', 'OTHER'],
            supportToWorkDeclinedReasonOther: 'Feels too stressed',
            circumstanceChangesRequiredToWork: ['DEPENDENCY_SUPPORT', 'MENTAL_HEALTH_SUPPORT', 'OTHER'],
            circumstanceChangesRequiredToWorkOther: 'Wants some financial advice',
          },
        },
      },
    },
  },
  G6115VJ: {
    request: {
      method: 'GET',
      urlPattern: '/readiness-profiles/G6115VJ',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        offenderId: 'G6115VJ',
        modifiedBy: 'USER1',
        modifiedDateTime: new Date().toISOString(),
        profileData: {
          status: 'NO_RIGHT_TO_WORK',
          modifiedBy: 'USER1',
          modifiedDateTime: new Date().toISOString(),
        },
      },
    },
  },
  A00001Z: {
    request: {
      method: 'GET',
      urlPattern: '/readiness-profiles/A00001Z',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        offenderId: 'A00001Z',
        modifiedBy: 'USER1',
        modifiedDateTime: new Date().toISOString(),
        profileData: {
          status: 'SUPPORT_NEEDED',
          modifiedBy: 'USER1',
          modifiedDateTime: new Date().toISOString(),
          supportAccepted: {
            actionsRequired: {
              modifiedBy: 'USER1',
              modifiedDateTime: new Date().toISOString(),
              actions: [
                {
                  todoItem: 'BANK_ACCOUNT',
                  status: 'NOT_STARTED',
                },
                {
                  todoItem: 'CV_AND_COVERING_LETTER',
                  status: 'NOT_STARTED',
                },
                {
                  todoItem: 'DISCLOSURE_LETTER',
                  status: 'NOT_STARTED',
                },
                {
                  todoItem: 'EMAIL_OR_PHONE',
                  status: 'COMPLETED',
                },
                {
                  todoItem: 'HOUSING',
                  status: 'COMPLETED',
                },
                {
                  todoItem: 'ID',
                  status: 'COMPLETED',
                },
              ],
            },
          },
        },
      },
    },
  },
}

export default profiles
