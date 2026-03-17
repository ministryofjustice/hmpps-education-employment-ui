const prisoners = {
  A00001A: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner/A00001A',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: 'A00001A',
        firstName: 'Test',
        lastName: 'User4',
        releaseDate: new Date().toISOString(),
        nonDtoReleaseDateType: 'HDC',
      },
    },
  },
  H4115SD: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner/H4115SD',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: 'H4115SD',
        firstName: 'Test',
        lastName: 'User1',
        releaseDate: new Date().toISOString(),
        nonDtoReleaseDateType: 'HDC',
      },
    },
  },
  G5005GD: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner/G5005GD',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: 'G5005GD',
        firstName: 'Test',
        lastName: 'User3',
        releaseDate: new Date().toISOString(),
        nonDtoReleaseDateType: 'HDC',
      },
    },
  },
  G6115VJ: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner/G6115VJ',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: 'G6115VJ',
        firstName: 'Test',
        lastName: 'User1',
        releaseDate: new Date().toISOString(),
        nonDtoReleaseDateType: 'HDC',
      },
    },
  },
  A00001Z: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner/A00001Z',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: 'A00001Z',
        firstName: 'Test',
        lastName: 'User5',
        releaseDate: new Date().toISOString(),
        nonDtoReleaseDateType: 'HDC',
      },
    },
  },
  A5167EC: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner/A5167EC',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: 'A5167EC',
        firstName: 'Test',
        lastName: 'User6',
      },
    },
  },
  G6115VK: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner/G6115VK',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerNumber: 'G6115VK',
        firstName: 'Test',
        lastName: 'User7',
      },
    },
  },
}

export default prisoners
