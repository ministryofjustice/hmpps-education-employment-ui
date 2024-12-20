import { stubFor } from './wiremock'

// Get job
const getJob = (id = '0190a227-be75-7009-8ad6-c6b068b6754e') =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/jobs/${id}/matching-candidate`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        id: '0190a227-be75-7009-8ad6-c6b068b6754e',
        employerId: '01907e1e-bb85-7bb7-9018-33a2070a367d',
        employerName: 'ASDA',
        jobTitle: 'Warehouse operator',
        sector: 'WAREHOUSING',
        industrySector: 'ADMIN_SUPPORT',
        numberOfVacancies: 1,
        sourcePrimary: 'NFN',
        sourceSecondary: 'PEL',
        charityName: 'Heart foundation',
        postcode: 'NE236DR',
        salaryFrom: 25000,
        salaryTo: 30000,
        salaryPeriod: 'PER_YEAR',
        additionalSalaryInformation: '10% Performance bonus',
        isPayingAtLeastNationalMinimumWage: true,
        workPattern: 'FLEXI_TIME',
        contractType: 'PERMANENT',
        hoursPerWeek: 'FULL_TIME_40_PLUS',
        baseLocation: 'WORKPLACE',
        essentialCriteria:
          'Valid forklift operator certification or licence\nProven experience operating a forklift in a warehouse or similar setting\n\nStrong knowledge of forklift safety procedures and best practices\nMaths level 1\nEnglish level 1\nPhysical stamina to perform repetitive tasks and lift heavy objects\nExcellent communication skills and ability to work well in a team environment',
        desirableCriteria:
          "What's on offer:\n\n5 days over 7, 05:30 to 15:30\nPaid weekly\nImmediate starts available\nFull training provided\nYour duties will include:\n\nManoeuvring forklifts safely in busy industrial environments\nSafely stacking and unstacking large quantities of goods onto shelves or pallets\nMoving goods from storage areas to loading areas for transport\nUnloading deliveries and safely relocating the goods to their designated storage areas\nEnsuring forklift driving areas are free from spills or obstructions\nRegularly checking forklift equipment for faults or damages\nConsolidating partial pallets for incoming goods",
        description:
          'Manoeuvring forklifts safely in busy industrial environments\nSafely stacking and unstacking large quantities of goods onto shelves or pallets\nMoving goods from storage areas to loading areas for transport',
        offenceExclusions: ['ARSON', 'TERRORISM', 'OTHER'],
        offenceExclusionsDetails: 'Some other exclusions',
        howToApply: 'Some apply details',
        closingDate: '2025-02-01T00:00:00.000Z',
        startDate: '2025-05-31T23:00:00.000Z',
        isRollingOpportunity: false,
        isOnlyForPrisonLeavers: true,
        supportingDocumentationRequired: ['CV', 'OTHER'],
        supportingDocumentationDetails: 'Covering letter',
        archived: false,
        hasExpressedInterest: false,
      },
    },
  })

const getEmployer = (id = '01907e1e-bb85-7bb7-9018-33a2070a367d') =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/employers/${id}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        name: 'ASDA',
        sector: 'ARTS_ENTERTAINMENT',
        status: 'GOLD',
        description: 'Some employer information and bio',
      },
    },
  })

const getMatchedJobsClosingSoon = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/candidate-matching/matched-jobs/closing-soon',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            id: 2,
            employerName: 'Amazon',
            jobTitle: 'Forklift operator',
            closingDate: '2022-05-01T17:00:00Z',
          },
        ],
      },
    },
  })

const getJobOfInterestClosingSoon = (prisonerId = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      url: `/candidate-matching/jobs-of-interest/${prisonerId}/closing-soon`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            id: 1,
            employerName: 'Tesco',
            jobTitle: 'Warehouse handler',
            closingDate: '2022-05-02T17:00:00Z',
          },
        ],
      },
    },
  })

const getArchivedJobs = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/candidate-matching/jobs/archived',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            id: 1,
            employerName: 'Amazon',
            jobTitle: 'Forklift operator',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 4.1,
            city: 'Leeds',
            postcode: 'LS23 3JF',
            typeOfWork: 'OUTDOOR',
            hasExpressedInterest: false,
          },
          {
            id: 2,
            employerName: 'Tesco',
            jobTitle: 'Warehouse handler',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 2.3,
            city: 'Leeds',
            postcode: 'LS23 5DH',
            typeOfWork: 'CLEANING_AND_MAINTENANCE',
            hasExpressedInterest: false,
          },
          {
            id: 4,
            employerName: 'Walmart',
            jobTitle: 'Cashier',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 6.5,
            city: 'Manchester',
            postcode: 'M12 6LP',
            typeOfWork: 'RETAIL',
            hasExpressedInterest: false,
          },
          {
            id: 5,
            employerName: "McDonald's",
            jobTitle: 'Crew Member',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 3.2,
            city: 'Birmingham',
            postcode: 'B4 6UD',
            typeOfWork: 'HOSPITALITY',
            hasExpressedInterest: false,
          },
          {
            id: 6,
            employerName: 'Starbucks',
            jobTitle: 'Barista',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 1.8,
            city: 'London',
            postcode: 'SW1A 1AA',
            typeOfWork: 'HOSPITALITY',
            hasExpressedInterest: true,
          },
          {
            id: 8,
            employerName: 'Burger King',
            jobTitle: 'Kitchen Staff',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 5.7,
            city: 'Glasgow',
            postcode: 'G1 1AA',
            typeOfWork: 'HOSPITALITY',
            hasExpressedInterest: false,
          },
          {
            id: 9,
            employerName: 'Lidl',
            jobTitle: 'Store Associate',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 2.1,
            city: 'Edinburgh',
            postcode: 'EH1 2AB',
            typeOfWork: 'RETAIL',
            hasExpressedInterest: false,
          },
          {
            id: 10,
            employerName: 'KFC',
            jobTitle: 'Shift Supervisor',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 4.9,
            city: 'Cardiff',
            postcode: 'CF10 1AB',
            typeOfWork: 'HOSPITALITY',
            hasExpressedInterest: false,
          },
          {
            id: 12,
            employerName: 'Pizza Hut',
            jobTitle: 'Delivery Driver',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 3.5,
            city: 'Bristol',
            postcode: 'BS1 1AB',
            typeOfWork: 'DRIVING',
            hasExpressedInterest: false,
          },
          {
            id: 13,
            employerName: 'Primark',
            jobTitle: 'Retail Assistant',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 1.2,
            city: 'Manchester',
            postcode: 'M1 1AA',
            typeOfWork: 'RETAIL',
            hasExpressedInterest: false,
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 20,
          totalPages: 2,
        },
      },
    },
  })

const getOtherJobsOfInterest = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/candidate-matching/jobs/interested',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            id: 1,
            employerName: 'Amazon',
            jobTitle: 'Forklift operator',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 4.1,
            city: 'Leeds',
            postcode: 'LS23 3JF',
            typeOfWork: 'OUTDOOR',
          },
          {
            id: 2,
            employerName: 'Tesco',
            jobTitle: 'Warehouse handler',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 2.3,
            city: 'Leeds',
            postcode: 'LS23 5DH',
            typeOfWork: 'CLEANING_AND_MAINTENANCE',
          },
          {
            id: 4,
            employerName: 'Walmart',
            jobTitle: 'Cashier',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 6.5,
            city: 'Manchester',
            postcode: 'M12 6LP',
            typeOfWork: 'RETAIL',
          },
          {
            id: 5,
            employerName: "McDonald's",
            jobTitle: 'Crew Member',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 3.2,
            city: 'Birmingham',
            postcode: 'B4 6UD',
            typeOfWork: 'HOSPITALITY',
          },
          {
            id: 6,
            employerName: 'Starbucks',
            jobTitle: 'Barista',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 1.8,
            city: 'London',
            postcode: 'SW1A 1AA',
            typeOfWork: 'HOSPITALITY',
          },
          {
            id: 8,
            employerName: 'Burger King',
            jobTitle: 'Kitchen Staff',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 5.7,
            city: 'Glasgow',
            postcode: 'G1 1AA',
            typeOfWork: 'HOSPITALITY',
          },
          {
            id: 9,
            employerName: 'Lidl',
            jobTitle: 'Store Associate',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 2.1,
            city: 'Edinburgh',
            postcode: 'EH1 2AB',
            typeOfWork: 'RETAIL',
          },
          {
            id: 10,
            employerName: 'KFC',
            jobTitle: 'Shift Supervisor',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 4.9,
            city: 'Cardiff',
            postcode: 'CF10 1AB',
            typeOfWork: 'HOSPITALITY',
          },
          {
            id: 12,
            employerName: 'Pizza Hut',
            jobTitle: 'Delivery Driver',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 3.5,
            city: 'Bristol',
            postcode: 'BS1 1AB',
            typeOfWork: 'DRIVING',
          },
          {
            id: 13,
            employerName: 'Primark',
            jobTitle: 'Retail Assistant',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 1.2,
            city: 'Manchester',
            postcode: 'M1 1AA',
            typeOfWork: 'RETAIL',
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 20,
          totalPages: 2,
        },
      },
    },
  })

const createArchiveRecord = (params: { jobId: string; offenderNo: string }) =>
  stubFor({
    request: {
      method: 'PUT',
      url: `/jobs/${params.jobId}/archived/${params.offenderNo}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

const deleteArchiveRecord = (params: { jobId: string; offenderNo: string }) =>
  stubFor({
    request: {
      method: 'DELETE',
      url: `/jobs/${params.jobId}/archived/${params.offenderNo}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

const createExpressionOfInterest = (params: { jobId: string; offenderNo: string }) =>
  stubFor({
    request: {
      method: 'PUT',
      url: `/jobs/${params.jobId}/expressions-of-interest/${params.offenderNo}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

const deleteExpressionOfInterest = (params: { jobId: string; offenderNo: string }) =>
  stubFor({
    request: {
      method: 'DELETE',
      url: `/jobs/${params.jobId}/expressions-of-interest/${params.offenderNo}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

const getMatchedJobs = () =>
  stubFor({
    request: {
      method: 'GET',
      url: '/jobs/matching-candidate',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            id: 1,
            employerName: 'Amazon',
            jobTitle: 'Forklift operator',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 4.1,
            city: 'Leeds',
            postcode: 'LS23 3JF',
            typeOfWork: 'OUTDOOR',
            hasExpressedInterest: true,
          },
          {
            id: 2,
            employerName: 'Tesco',
            jobTitle: 'Warehouse handler',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 2.3,
            city: 'Leeds',
            postcode: 'LS23 5DH',
            typeOfWork: 'CLEANING_AND_MAINTENANCE',
            hasExpressedInterest: false,
          },
          {
            id: 4,
            employerName: 'Walmart',
            jobTitle: 'Cashier',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 6.5,
            city: 'Manchester',
            postcode: 'M12 6LP',
            typeOfWork: 'RETAIL',
            hasExpressedInterest: false,
          },
          {
            id: 5,
            employerName: "McDonald's",
            jobTitle: 'Crew Member',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 3.2,
            city: 'Birmingham',
            postcode: 'B4 6UD',
            typeOfWork: 'HOSPITALITY',
            hasExpressedInterest: false,
          },
          {
            id: 6,
            employerName: 'Starbucks',
            jobTitle: 'Barista',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 1.8,
            city: 'London',
            postcode: 'SW1A 1AA',
            typeOfWork: 'HOSPITALITY',
            hasExpressedInterest: true,
          },
          {
            id: 8,
            employerName: 'Burger King',
            jobTitle: 'Kitchen Staff',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 5.7,
            city: 'Glasgow',
            postcode: 'G1 1AA',
            typeOfWork: 'HOSPITALITY',
            hasExpressedInterest: false,
          },
          {
            id: 9,
            employerName: 'Lidl',
            jobTitle: 'Store Associate',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 2.1,
            city: 'Edinburgh',
            postcode: 'EH1 2AB',
            typeOfWork: 'RETAIL',
            hasExpressedInterest: false,
          },
          {
            id: 10,
            employerName: 'KFC',
            jobTitle: 'Shift Supervisor',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 4.9,
            city: 'Cardiff',
            postcode: 'CF10 1AB',
            typeOfWork: 'HOSPITALITY',
            hasExpressedInterest: false,
          },
          {
            id: 12,
            employerName: 'Pizza Hut',
            jobTitle: 'Delivery Driver',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 3.5,
            city: 'Bristol',
            postcode: 'BS1 1AB',
            typeOfWork: 'DRIVING',
            hasExpressedInterest: false,
          },
          {
            id: 13,
            employerName: 'Primark',
            jobTitle: 'Retail Assistant',
            closingDate: '2024-06-03T14:21:24.852Z',
            distance: 1.2,
            city: 'Manchester',
            postcode: 'M1 1AA',
            typeOfWork: 'RETAIL',
            hasExpressedInterest: false,
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 20,
          totalPages: 2,
        },
      },
    },
  })

export default {
  getJob,
  getEmployer,
  getMatchedJobsClosingSoon,
  getJobOfInterestClosingSoon,
  getArchivedJobs,
  getOtherJobsOfInterest,
  createArchiveRecord,
  deleteArchiveRecord,
  createExpressionOfInterest,
  deleteExpressionOfInterest,
  getMatchedJobs,
}
