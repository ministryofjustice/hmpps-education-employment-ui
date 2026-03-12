const job1 = {
  id: 1,
  employerName: 'Amazon',
  jobTitle: 'Forklift operator',
  closingDate: '2024-06-03T14:21:24.852Z',
  distance: 4.1,
  postcode: 'LS23 3JF',
  sector: 'OUTDOOR',
  hasExpressedInterest: true,
  isNational: false,
  numberOfVacancies: 1,
}

const job2 = {
  id: 2,
  employerName: 'Tesco',
  jobTitle: 'Warehouse handler',
  closingDate: '2024-06-03T14:21:24.852Z',
  distance: 2.3,
  postcode: 'LS23 5DH',
  sector: 'CLEANING_AND_MAINTENANCE',
  hasExpressedInterest: false,
  isNational: false,
  numberOfVacancies: 2,
}

const job3 = {
  id: 3,
  employerName: 'Walmart',
  jobTitle: 'Cashier 2',
  closingDate: '2024-06-03T14:21:24.852Z',
  distance: 6.5,
  postcode: 'M12 6LP',
  sector: 'RETAIL',
  hasExpressedInterest: false,
  isNational: false,
  numberOfVacancies: 1,
}

const job4 = {
  id: 4,
  employerName: 'Walmart',
  jobTitle: 'Cashier',
  closingDate: '2024-06-03T14:21:24.852Z',
  distance: 6.5,
  postcode: 'M12 6LP',
  sector: 'RETAIL',
  hasExpressedInterest: false,
  isNational: false,
  numberOfVacancies: 1,
}

const job5 = {
  id: 5,
  employerName: "McDonald's",
  jobTitle: 'Crew Member',
  closingDate: '2024-06-03T14:21:24.852Z',
  distance: 3.2,
  postcode: 'B4 6UD',
  sector: 'HOSPITALITY',
  hasExpressedInterest: false,
  isNational: false,
  numberOfVacancies: 1,
}

const job6 = {
  id: 6,
  employerName: 'Starbucks',
  jobTitle: 'Barista',
  closingDate: '2024-06-03T14:21:24.852Z',
  distance: 1.8,
  postcode: 'SW1A 1AA',
  sector: 'HOSPITALITY',
  hasExpressedInterest: true,
  isNational: false,
  numberOfVacancies: 1,
}

const job8 = {
  id: 8,
  employerName: 'Burger King',
  jobTitle: 'Kitchen Staff',
  closingDate: '2024-06-02T14:21:24.852Z',
  distance: 5.7,
  postcode: 'G1 1AA',
  sector: 'HOSPITALITY',
  hasExpressedInterest: false,
  isNational: false,
  numberOfVacancies: 1,
}

const job9 = {
  id: 9,
  employerName: 'Lidl',
  jobTitle: 'Store Associate',
  closingDate: '2024-06-04T14:21:24.852Z',
  distance: 2.1,
  postcode: 'EH1 2AB',
  sector: 'RETAIL',
  hasExpressedInterest: false,
  isNational: false,
  numberOfVacancies: 3,
}

const job10 = {
  id: 10,
  employerName: 'KFC',
  jobTitle: 'Shift Supervisor',
  closingDate: '2024-06-03T14:21:24.852Z',
  distance: 4.9,
  postcode: 'CF10 1AB',
  sector: 'HOSPITALITY',
  hasExpressedInterest: false,
  isNational: false,
  numberOfVacancies: 1,
}

const job12 = {
  id: 12,
  employerName: 'Pizza Hut',
  jobTitle: 'Delivery Driver',
  closingDate: '2024-07-03T14:21:24.852Z',
  distance: 3.5,
  postcode: 'BS1 1AB',
  sector: 'DRIVING',
  hasExpressedInterest: false,
  isNational: false,
  numberOfVacancies: 1,
}

const job13 = {
  id: 13,
  employerName: 'Primark',
  jobTitle: 'Retail Assistant',
  closingDate: '2024-06-03T14:21:24.852Z',
  distance: 1.2,
  postcode: 'M1 1AA',
  sector: 'RETAIL',
  hasExpressedInterest: false,
  isNational: false,
  numberOfVacancies: 1,
}

const filterDefault =
  'page=0&size=20&sortBy=closingDate&sortOrder=asc&sectors=CONSTRUCTION%2COUTDOOR%2CRETAIL&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'
const filterDefaultNational =
  'page=0&size=20&sortBy=closingDate&sortOrder=asc&sectors=CONSTRUCTION%2COUTDOOR%2CRETAIL&prisonNumber=G6115VK&isNationalJob=true'

const filterDistanceNoRestriction = 'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&isNationalJob=false'
const filterDistance1 = 'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=1&isNationalJob=false'
const filterDistance5 = 'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=5&isNationalJob=false'
const filterDistance10 = 'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=10&isNationalJob=false'
const filterDistance20 = 'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=20&isNationalJob=false'
const filterDistance50 = 'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'

const filterSectorConstruction =
  'page=0&size=20&sectors=CONSTRUCTION&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'
const filterSectorOutdoor =
  'page=0&size=20&sectors=OUTDOOR&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'
const filterSectorOutdoorAndCleaning =
  'page=0&size=20&sectors=OUTDOOR%2CCLEANING_AND_MAINTENANCE&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'
const filterSectorCleaning =
  'page=0&size=20&sectors=CLEANING_AND_MAINTENANCE&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'

const filterOffencesArsonAndDriving =
  'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false&offenceExclusions=ARSON%2CDRIVING'

const filterReleaseAreaEmpty = 'page=0&size=20&prisonNumber=G6115VK&isNationalJob=false'

const filterSectorOutdoorAndCleaningAndOffencesDrivingAndDistance20 =
  'page=0&size=20&sectors=OUTDOOR%2CCLEANING_AND_MAINTENANCE&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=20&isNationalJob=false&offenceExclusions=DRIVING'

const filterSectorOutdoorAndRetailAndCleaningAndOffencesDrivingAndDistance20 =
  'page=0&size=20&sectors=OUTDOOR%2CRETAIL%2CCLEANING_AND_MAINTENANCE&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=20&isNationalJob=false&offenceExclusions=DRIVING'

const filterSectorOutdoorAndRetailAndCleaningAndOffencesDriving =
  'page=0&size=20&sectors=OUTDOOR%2CRETAIL%2CCLEANING_AND_MAINTENANCE&prisonNumber=G6115VK&isNationalJob=false&offenceExclusions=DRIVING'

const filterSortByJobTitleAsc =
  'page=0&size=20&sortBy=jobTitle&sortOrder=asc&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'

const filterSortByJobTitleDesc =
  'page=0&size=20&sortBy=jobTitle&sortOrder=desc&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'

const filterSortByDistanceAsc =
  'page=0&size=20&sortBy=distance&sortOrder=asc&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'

const filterSortByDistanceDesc =
  'page=0&size=20&sortBy=distance&sortOrder=desc&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'

const filterSortByClosingDateAsc =
  'page=0&size=20&sortBy=closingDate&sortOrder=asc&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'

const filterSortByClosingDateDesc =
  'page=0&size=20&sortBy=closingDate&sortOrder=desc&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'

export const matchedJobs = {
  [filterDefault]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterDefault}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job1, job3, job4, job9, job13],
        page: {
          size: 10,
          number: 0,
          totalElements: 5,
          totalPages: 1,
        },
      },
    },
  },
  [filterDefaultNational]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterDefaultNational}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [], // TODO: Add national jobs
        page: {
          size: 10,
          number: 0,
          totalElements: 5,
          totalPages: 1,
        },
      },
    },
  },
  [filterDistance50]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterDistance50}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job1, job2, job3, job4, job5, job6, job8, job12, job13],
        page: {
          size: 10,
          number: 0,
          totalElements: 9,
          totalPages: 1,
        },
      },
    },
  },
  [filterDistance20]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterDistance20}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job1, job2, job6, job8, job12, job13],
        page: {
          size: 10,
          number: 0,
          totalElements: 6,
          totalPages: 1,
        },
      },
    },
  },
  [filterDistance10]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterDistance10}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job2, job6, job8, job12, job13],
        page: {
          size: 10,
          number: 0,
          totalElements: 5,
          totalPages: 1,
        },
      },
    },
  },
  [filterDistance5]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterDistance5}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job6, job8, job12, job13],
        page: {
          size: 10,
          number: 0,
          totalElements: 4,
          totalPages: 1,
        },
      },
    },
  },
  [filterDistance1]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterDistance1}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job6],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    },
  },
  [filterDistanceNoRestriction]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterDistanceNoRestriction}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job1, job2, job3, job4, job5, job6, job8, job9, job10, job12, job13],
        page: {
          size: 10,
          number: 0,
          totalElements: 11,
          totalPages: 2,
        },
      },
    },
  },
  [filterSectorConstruction]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterSectorConstruction}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [],
        page: {
          size: 10,
          number: 0,
          totalElements: 0,
          totalPages: 1,
        },
      },
    },
  },
  [filterSectorOutdoor]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterSectorOutdoor}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job1],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    },
  },
  [filterSectorOutdoorAndCleaning]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterSectorOutdoorAndCleaning}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job1, job2],
        page: {
          size: 10,
          number: 0,
          totalElements: 2,
          totalPages: 1,
        },
      },
    },
  },
  [filterSectorCleaning]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterSectorCleaning}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job2],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    },
  },
  [filterOffencesArsonAndDriving]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterOffencesArsonAndDriving}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job1, job2, job3, job4, job5, job6, job8, job13],
        page: {
          size: 10,
          number: 0,
          totalElements: 8,
          totalPages: 1,
        },
      },
    },
  },
  [filterReleaseAreaEmpty]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterReleaseAreaEmpty}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job1, job2, job3, job4, job5, job6, job8, job13],
        page: {
          size: 10,
          number: 0,
          totalElements: 8,
          totalPages: 1,
        },
      },
    },
  },
  [filterSectorOutdoorAndCleaningAndOffencesDrivingAndDistance20]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterSectorOutdoorAndCleaningAndOffencesDrivingAndDistance20}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job1, job2, job3, job4, job5, job6],
        page: {
          size: 10,
          number: 0,
          totalElements: 6,
          totalPages: 1,
        },
      },
    },
  },
  [filterSectorOutdoorAndRetailAndCleaningAndOffencesDrivingAndDistance20]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterSectorOutdoorAndRetailAndCleaningAndOffencesDrivingAndDistance20}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job1, job2, job3, job4, job5, job6, job8],
        page: {
          size: 10,
          number: 0,
          totalElements: 7,
          totalPages: 1,
        },
      },
    },
  },
  [filterSectorOutdoorAndRetailAndCleaningAndOffencesDriving]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterSectorOutdoorAndRetailAndCleaningAndOffencesDriving}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job1, job2, job3, job4, job5, job6, job8, job13],
        page: {
          size: 10,
          number: 0,
          totalElements: 8,
          totalPages: 1,
        },
      },
    },
  },
  [filterSortByJobTitleAsc]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterSortByJobTitleAsc}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job6, job1, job2, job3, job4, job5, job8, job12, job13],
        page: {
          size: 10,
          number: 0,
          totalElements: 9,
          totalPages: 1,
        },
      },
    },
  },
  [filterSortByJobTitleDesc]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterSortByJobTitleDesc}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job13, job12, job8, job5, job4, job3, job2, job1, job6],
        page: {
          size: 10,
          number: 0,
          totalElements: 9,
          totalPages: 1,
        },
      },
    },
  },
  [filterSortByDistanceAsc]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterSortByDistanceAsc}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job13, job6, job1, job2, job3, job4, job5, job8, job12],
        page: {
          size: 10,
          number: 0,
          totalElements: 9,
          totalPages: 1,
        },
      },
    },
  },
  [filterSortByDistanceDesc]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterSortByDistanceDesc}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job4, job6, job1, job2, job3, job5, job8, job12, job13],
        page: {
          size: 10,
          number: 0,
          totalElements: 9,
          totalPages: 1,
        },
      },
    },
  },
  [filterSortByClosingDateAsc]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterSortByClosingDateAsc}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job8, job6, job1, job2, job3, job4, job5, job12, job13],
        page: {
          size: 10,
          number: 0,
          totalElements: 9,
          totalPages: 1,
        },
      },
    },
  },
  [filterSortByClosingDateDesc]: {
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${filterSortByClosingDateDesc}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [job12, job6, job1, job2, job3, job4, job5, job8, job13],
        page: {
          size: 10,
          number: 0,
          totalElements: 9,
          totalPages: 1,
        },
      },
    },
  },
}

export default {
  matchedJobs,
}
