import { stubFor } from './wiremock'

const getOpenApplications = (prisonerId = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      url: `/applications/open?prisonNumber=${prisonerId}&size=9999`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            id: '019320a4-a8a5-7667-aeb4-fdd8d7e48c2c',
            jobId: '0191795f-cbfc-733f-bcf6-080a82390733',
            employerName: 'Debenhams',
            jobTitle: 'Human Resources Manager',
            applicationStatus: 'APPLICATION_MADE',
            createdAt: '2024-11-12T13:51:22.525858Z',
            lastModifiedAt: '2024-11-12T13:53:14.033160Z',
          },
        ],
        page: { size: 9999, number: 0, totalElements: 1, totalPages: 1 },
      },
    },
  })

const getClosedApplications = (prisonerId = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      url: `/applications/closed?prisonNumber=${prisonerId}&size=9999`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          id: '019320a4-a8a5-7667-aeb4-fdd8d7e48c2c',
          jobId: '0191795f-cbfc-733f-bcf6-080a82390733',
          employerName: 'Debenhams',
          jobTitle: 'Human Resources Manager',
          applicationStatus: 'JOB_OFFER',
          createdAt: '2024-11-12T13:51:22.525858Z',
          lastModifiedAt: '2024-11-12T13:53:14.033160Z',
        },
      ],
    },
  })

const getApplicationHistory = (params = { prisonerId: 'G6115VJ', jobId: '0191795f-cbfc-733f-bcf6-080a82390733' }) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/applications/histories`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          id: '019320a4-a8a5-7667-aeb4-fdd8d7e48c2c',
          jobId: '0191795f-cbfc-733f-bcf6-080a82390733',
          prisonNumber: 'G3607UQ',
          prisonId: 'MDI',
          firstName: 'BEAUREGARD',
          lastName: 'YABUT',
          applicationStatus: 'APPLICATION_MADE',
          additionalInformation: '',
          createdBy: 'GDUTTON_GEN',
          createdAt: '2024-11-12T13:51:22.525858Z',
          modifiedBy: 'GDUTTON_GEN',
          modifiedAt: '2024-11-12T13:51:22.525858Z',
        },
        {
          id: '019320a4-a8a5-7667-aeb4-fdd8d7e48c2c',
          jobId: '0191795f-cbfc-733f-bcf6-080a82390733',
          prisonNumber: 'G3607UQ',
          prisonId: 'MDI',
          firstName: 'BEAUREGARD',
          lastName: 'YABUT',
          applicationStatus: 'JOB_OFFER',
          additionalInformation: '',
          createdBy: 'GDUTTON_GEN',
          createdAt: '2024-11-12T13:51:22.525858Z',
          modifiedBy: 'GDUTTON_GEN',
          modifiedAt: '2024-11-12T13:53:14.033160Z',
        },
      ],
    },
  })

const updateApplicationHistory = () =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: '/applications/',
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
      method: 'GET',
      url: '/applications',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            id: 'b7192cfc-8fcd-494b-826a-d62c99948c99',
            jobId: '0191795f-455e-733f-bcf5-f61cdbec6276',
            prisonNumber: 'GC12HDK',
            prisonId: 'MDI',
            firstName: 'JOE',
            lastName: 'BLOGGS',
            employerName: 'Boots',
            jobTitle: 'Accountant',
            applicationStatus: 'JOB_OFFER',
            createdAt: '2024-10-24T08:21:29.090977Z',
            lastModifiedAt: '2024-10-24T08:21:41.798854Z',
          },
          {
            id: '1580b40b-cc98-4a7c-887d-9c25b8ac1805',
            jobId: '01917963-3171-733f-bcf6-8bbb13807060',
            prisonNumber: 'GC12HDK',
            prisonId: 'MDI',
            firstName: 'JOE',
            lastName: 'BLOGGS',
            employerName: 'TK Maxx',
            jobTitle: 'Quality Assurance Engineer',
            applicationStatus: 'APPLICATION_MADE',
            createdAt: '2024-10-31T09:56:42.819979Z',
            lastModifiedAt: '2024-10-31T09:56:42.819979Z',
          },
          {
            id: '019301ed-b637-7992-996c-333d95009703',
            jobId: '0192bd72-4cb7-7aaf-b1dc-67c7d934c32d',
            prisonNumber: 'A5058DY',
            prisonId: 'MDI',
            firstName: 'ABDUL',
            lastName: 'LINK',
            employerName: 'ASDA',
            jobTitle: 'Warehouse operator',
            applicationStatus: 'SELECTED_FOR_INTERVIEW',
            createdAt: '2024-11-06T14:42:56.229556Z',
            lastModifiedAt: '2024-11-06T14:42:56.229556Z',
          },
          {
            id: '01930157-ed79-7446-8c76-9333aaa4a2a0',
            jobId: '0192bd72-4cb7-7aaf-b1dc-67c7d934c32d',
            prisonNumber: 'A5058DY',
            prisonId: 'MDI',
            firstName: 'ABDUL',
            lastName: 'LINK',
            employerName: 'ASDA',
            jobTitle: 'Warehouse operator',
            applicationStatus: 'APPLICATION_MADE',
            createdAt: '2024-11-06T11:59:20.641410Z',
            lastModifiedAt: '2024-11-06T11:59:20.641410Z',
          },
          {
            id: '01932012-4e55-7446-9c64-ce1f0b4d4313',
            jobId: '0191795f-cbfc-733f-bcf6-080a82390733',
            prisonNumber: 'A6666DZ',
            prisonId: 'MDI',
            firstName: 'GARTH',
            lastName: 'NERVOUS',
            employerName: 'Debenhams',
            jobTitle: 'Human Resources Manager',
            applicationStatus: 'APPLICATION_UNSUCCESSFUL',
            createdAt: '2024-11-12T11:11:31.548712Z',
            lastModifiedAt: '2024-11-12T11:15:51.641705Z',
          },
          {
            id: '0192e303-a9e4-799d-b6f6-eeb62c428094',
            jobId: '0191795e-c37d-733f-bcf5-deb993785902',
            prisonNumber: 'A6666DZ',
            prisonId: 'MDI',
            firstName: 'GARTH',
            lastName: 'NERVOUS',
            employerName: 'Waitrose',
            jobTitle: 'Software Engineer',
            applicationStatus: 'APPLICATION_MADE',
            createdAt: '2024-10-31T14:38:41.174251Z',
            lastModifiedAt: '2024-10-31T14:38:41.174251Z',
          },
          {
            id: '019320b7-d770-7667-aeb5-00b8becfb1d3',
            jobId: '01917965-d5a0-733f-bcf6-d7f883b20d59',
            prisonNumber: 'A6667DZ',
            prisonId: 'MDI',
            firstName: 'MAX',
            lastName: 'PANSCOURER',
            employerName: 'Ryman',
            jobTitle: 'Accountant',
            applicationStatus: 'APPLICATION_UNSUCCESSFUL',
            createdAt: '2024-11-12T14:12:19.700086Z',
            lastModifiedAt: '2024-11-12T14:14:05.788685Z',
          },
          {
            id: '0192e214-c375-799d-b6f6-e26e7563a806',
            jobId: '0192be70-c452-7aaf-b1dc-740b8e2dfeb1',
            prisonNumber: 'G5310GO',
            prisonId: 'MDI',
            firstName: 'FOX',
            lastName: 'SAPIENZA',
            employerName: 'Docker',
            jobTitle: 'Developer',
            applicationStatus: 'INTERVIEW_BOOKED',
            createdAt: '2024-10-31T10:17:44.671799Z',
            lastModifiedAt: '2024-10-31T10:22:09.586191Z',
          },
          {
            id: '01932031-9b27-7886-ace7-ff0aac0a2f4c',
            jobId: '01917964-9cde-733f-bcf6-b7f432229f40',
            prisonNumber: 'G5310GO',
            prisonId: 'MDI',
            firstName: 'FOX',
            lastName: 'SAPIENZA',
            employerName: 'Staples',
            jobTitle: 'Project Manager',
            applicationStatus: 'APPLICATION_UNSUCCESSFUL',
            createdAt: '2024-11-12T11:45:42.536362Z',
            lastModifiedAt: '2024-11-12T11:49:19.079675Z',
          },
          {
            id: '019320a4-a8a5-7667-aeb4-fdd8d7e48c2c',
            jobId: '0191795f-cbfc-733f-bcf6-080a82390733',
            prisonNumber: 'G3607UQ',
            prisonId: 'MDI',
            firstName: 'BEAUREGARD',
            lastName: 'YABUT',
            employerName: 'Debenhams',
            jobTitle: 'Human Resources Manager',
            applicationStatus: 'JOB_OFFER',
            createdAt: '2024-11-12T13:51:22.525858Z',
            lastModifiedAt: '2024-11-12T13:53:14.033160Z',
          },
        ],
        page: { size: 20, number: 0, totalElements: 10, totalPages: 1 },
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
