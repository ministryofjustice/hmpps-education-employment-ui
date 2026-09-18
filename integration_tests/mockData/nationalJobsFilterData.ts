import { stubFor } from '../mockApis/wiremock'

export const defaultNationalJobsResponse = {
  content: [
    {
      id: 1,
      employerName: 'Carrefour',
      jobTitle: 'Assistant manager',
      closingDate: null,
      distance: null,
      postcode: null,
      sector: 'RETAIL',
      hasExpressedInterest: false,
      isNational: true,
      numberOfVacancies: 1,
    },
  ],
  page: {
    size: 10,
    number: 0,
    totalElements: 1,
    totalPages: 1,
  },
}

export const offenceExclusionNationalJobsResponse = {
  content: [
    {
      id: 1,
      employerName: 'Tesco',
      jobTitle: 'Sales manager',
      closingDate: null,
      distance: null,
      postcode: null,
      sector: 'RETAIL',
      hasExpressedInterest: false,
      isNational: true,
      numberOfVacancies: 2,
    },
    {
      id: 1,
      employerName: 'Amazon',
      jobTitle: 'Forklift operator',
      closingDate: null,
      distance: null,
      postcode: null,
      sector: 'OUTDOOR',
      hasExpressedInterest: true,
      isNational: true,
      numberOfVacancies: 5,
    },
  ],
  page: {
    size: 10,
    number: 0,
    totalElements: 2,
    totalPages: 1,
  },
}

export const emptyNationalJobsResponse = {
  content: [],
  page: {
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  },
}

export const stubNationalJobs = (queryString: string, body: unknown) =>
  stubFor({
    request: {
      method: 'GET',
      url: `/jobs/matching-candidate?${queryString}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: body,
    },
  })
