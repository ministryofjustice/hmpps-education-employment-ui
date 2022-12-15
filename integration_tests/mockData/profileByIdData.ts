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
        profileData: {
          status: 'SUPPORT_NEEDED',
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
        profileData: {
          status: 'SUPPORT_DECLINED',
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
        profileData: {
          status: 'NO_RIGHT_TO_WORK',
        },
      },
    },
  },
}

export default profiles
