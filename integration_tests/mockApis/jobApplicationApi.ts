import { stubFor } from './wiremock'

const getOpenApplications = (prisonerId = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      url: `/candidate-matching/applications/${prisonerId}/closed`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          id: 4,
          jobId: 3,
          employerName: 'Z Labour',
          jobTitle: 'Forklift operator',
          applicationStatus: 'APPLICATION_UNSUCCESSFUL',
        },
        {
          id: 7,
          jobId: 4,
          employerName: 'Wilco',
          jobTitle: 'Vegetable packing operative',
          applicationStatus: 'UNSUCCESSFUL_AT_INTERVIEW',
        },
      ],
    },
  })

const getClosedApplications = (prisonerId = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      url: `/candidate-matching/applications/${prisonerId}/open`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          id: 1,
          jobId: 2,
          employerName: 'CBS Labour',
          jobTitle: 'Vegetable packing operative',
          applicationStatus: 'APPLICATION_MADE',
        },
        {
          id: 2,
          jobId: 5,
          employerName: 'Tesco',
          jobTitle: 'Vegetable packing operative',
          applicationStatus: 'INTERVIEW_BOOKED',
        },
      ],
    },
  })

const getApplicationHistory = (params = { prisonerId: 'G6115VJ', jobId: '1' }) =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/candidate-matching/applications/${params.prisonerId}/job/${params.jobId}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          createdByName: 'GDUTTON',
          createdDateTime: '2023-10-20T09:24:58.903672',
          additionalInformation: 'Some info',
          applicationStatus: 'APPLICATION_MADE',
        },
        {
          createdByName: 'GDUTTON',
          createdDateTime: '2023-10-20T10:24:58.903672',
          additionalInformation: '',
          applicationStatus: 'INTERVIEW_BOOKED',
        },
      ],
    },
  })

const updateApplicationHistory = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/candidate-matching/application',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {},
    },
  })

const applicationSearch = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/candidate-matching/applications/search',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            jobId: 1,
            prisonId: 'MDI',
            jobTitle: 'Vegetable packing operative',
            prisonerNumber: 'A8272DY',
            employerName: 'CBS packing',
            firstName: 'ADAM',
            lastName: 'ARHMED',
            applicationStatus: 'APPLICATION_MADE',
          },
          {
            jobId: 2,
            prisonId: 'MDI',
            jobTitle: 'Forklift operator',
            prisonerNumber: 'G3607UQ',
            employerName: 'Amazon',
            firstName: 'CHARLES',
            lastName: 'JERMAINE',
            applicationStatus: 'SELECTED_FOR_INTERVIEW',
          },
          {
            jobId: 3,
            prisonId: 'MDI',
            jobTitle: 'Retail assistant',
            prisonerNumber: 'G5310GO',
            employerName: 'Iceland',
            firstName: 'ROSS',
            lastName: 'MCLAUGHLAN',
            applicationStatus: 'APPLICATION_MADE',
          },
          {
            jobId: 4,
            prisonId: 'MDI',
            jobTitle: 'Warehouse worker',
            prisonerNumber: 'A8272DY',
            employerName: 'Logistics Co',
            firstName: 'BRIAN',
            lastName: 'SMITH',
            applicationStatus: 'APPLICATION_UNSUCCESSFUL',
          },
          {
            jobId: 5,
            prisonId: 'MDI',
            jobTitle: 'Delivery driver',
            prisonerNumber: 'G3607UQ',
            employerName: 'Fast Deliveries',
            firstName: 'ALAN',
            lastName: 'DOE',
            applicationStatus: 'INTERVIEW_BOOKED',
          },
          {
            jobId: 6,
            prisonId: 'MDI',
            jobTitle: 'Chef',
            prisonerNumber: 'G5310GO',
            employerName: 'Fine Dine',
            firstName: 'JOHN',
            lastName: 'WILSON',
            applicationStatus: 'UNSUCCESSFUL_AT_INTERVIEW',
          },
          {
            jobId: 7,
            prisonId: 'MDI',
            jobTitle: 'Gardener',
            prisonerNumber: 'A8272DY',
            employerName: 'Green Thumb',
            firstName: 'MIKE',
            lastName: 'BROWN',
            applicationStatus: 'JOB_OFFER',
          },
          {
            jobId: 8,
            prisonId: 'MDI',
            jobTitle: 'Cleaner',
            prisonerNumber: 'G3607UQ',
            employerName: 'Sparkle Clean',
            firstName: 'JIM',
            lastName: 'TAYLOR',
            applicationStatus: 'APPLICATION_MADE',
          },
          {
            jobId: 9,
            prisonId: 'MDI',
            jobTitle: 'Painter',
            prisonerNumber: 'G5310GO',
            employerName: 'Color Co',
            firstName: 'DAN',
            lastName: 'JOHNSON',
            applicationStatus: 'APPLICATION_UNSUCCESSFUL',
          },
          {
            jobId: 10,
            prisonId: 'MDI',
            jobTitle: 'Electrician',
            prisonerNumber: 'A8272DY',
            employerName: 'Power Co',
            firstName: 'STEVE',
            lastName: 'DAVIS',
            applicationStatus: 'SELECTED_FOR_INTERVIEW',
          },
        ],
        pageable: {
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          pageSize: 10,
          pageNumber: 0,
          paged: true,
          unpaged: false,
        },
        totalElements: 24,
        last: false,
        totalPages: 3,
        size: 10,
        number: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        first: true,
        numberOfElements: 10,
        empty: false,
      },
    },
  })

export default {
  getOpenApplications,
  getClosedApplications,
  getApplicationHistory,
  updateApplicationHistory,
  applicationSearch,
}
