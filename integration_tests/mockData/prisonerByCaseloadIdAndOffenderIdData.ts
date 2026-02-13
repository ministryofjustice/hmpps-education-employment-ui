const prisonersByCaseloadIdAndOffenderId = {
  A00001A: {
    request: {
      method: 'GET',
      urlPathPattern: '/prison/\\w+/prisoners',
      queryParameters: {
        term: {
          matches: '.*',
        },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            prisonerNumber: 'A8317DY',
            firstName: 'SUSAN',
            lastName: 'VICTOR',
            prisonId: 'MDI',
            releaseDate: '2026-03-02',
          },
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 1,
          sort: {
            empty: true,
            sorted: false,
            unsorted: true,
          },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        last: true,
        totalElements: 1,
        totalPages: 1,
        size: 1,
        number: 0,
        first: true,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        numberOfElements: 1,
        empty: false,
      },
    },
  },
  H4115SD: {
    request: {
      method: 'GET',
      urlPathPattern: '/prison/\\w+/prisoners',
      queryParameters: {
        term: {
          matches: '.*',
        },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            prisonerNumber: 'A8317DY',
            firstName: 'SUSAN',
            lastName: 'VICTOR',
            prisonId: 'MDI',
            releaseDate: '2026-03-02',
          },
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 1,
          sort: {
            empty: true,
            sorted: false,
            unsorted: true,
          },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        last: true,
        totalElements: 1,
        totalPages: 1,
        size: 1,
        number: 0,
        first: true,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        numberOfElements: 1,
        empty: false,
      },
    },
  },
  G5005GD: {
    request: {
      method: 'GET',
      urlPathPattern: '/prison/\\w+/prisoners',
      queryParameters: {
        term: {
          matches: '.*',
        },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            prisonerNumber: 'A8317DY',
            firstName: 'SUSAN',
            lastName: 'VICTOR',
            prisonId: 'MDI',
            releaseDate: '2026-03-02',
          },
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 1,
          sort: {
            empty: true,
            sorted: false,
            unsorted: true,
          },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        last: true,
        totalElements: 1,
        totalPages: 1,
        size: 1,
        number: 0,
        first: true,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        numberOfElements: 1,
        empty: false,
      },
    },
  },
  G6115VJ: {
    request: {
      method: 'GET',
      urlPathPattern: '/prison/\\w+/prisoners',
      queryParameters: {
        term: {
          matches: '.*',
        },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            prisonerNumber: 'A8317DY',
            firstName: 'SUSAN',
            lastName: 'VICTOR',
            prisonId: 'MDI',
            releaseDate: '2026-03-02',
          },
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 1,
          sort: {
            empty: true,
            sorted: false,
            unsorted: true,
          },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        last: true,
        totalElements: 1,
        totalPages: 1,
        size: 1,
        number: 0,
        first: true,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        numberOfElements: 1,
        empty: false,
      },
    },
  },
  A00001Z: {
    request: {
      method: 'GET',
      urlPathPattern: '/prison/\\w+/prisoners',
      queryParameters: {
        term: {
          matches: '.*',
        },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: 1,
          sort: {
            empty: true,
            sorted: false,
            unsorted: true,
          },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        last: true,
        totalElements: 0,
        totalPages: 0,
        size: 1,
        number: 0,
        first: true,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        numberOfElements: 0,
        empty: true,
      },
    },
  },
}

export default prisonersByCaseloadIdAndOffenderId
