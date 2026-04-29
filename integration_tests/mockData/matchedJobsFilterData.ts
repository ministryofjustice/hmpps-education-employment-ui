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
  closingDate: '2024-06-03T14:21:24.852Z',
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
  closingDate: '2024-06-03T14:21:24.852Z',
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
  closingDate: '2024-06-03T14:21:24.852Z',
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

const filterDistance50 = 'page=0&size=20&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'
const filterSectorConstruction =
  'page=0&size=20&sectors=CONSTRUCTION&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'
const filterDefault =
  'page=0&size=20&sortBy=closingDate&sortOrder=asc&sectors=CONSTRUCTION%2COUTDOOR%2CRETAIL&prisonNumber=G6115VK&releaseArea=L15%207LR&searchRadius=50&isNationalJob=false'
const filterDefaultNational =
  'page=0&size=20&sortBy=closingDate&sortOrder=asc&sectors=CONSTRUCTION%2COUTDOOR%2CRETAIL&prisonNumber=G6115VK&isNationalJob=true'

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
}

export default {
  matchedJobs,
}
