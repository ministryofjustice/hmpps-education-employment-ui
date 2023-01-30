import { stubFor } from './wiremock'

const getCurrentOffenderActivities = (id = 'G6115VJ') =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/prisonApi/api/offender-activities/${id}/activities-history`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            bookingId: 1102484,
            agencyLocationId: 'MDI',
            agencyLocationDescription: 'Moorland (HMP & YOI)',
            description: 'Braille am',
            startDate: '2021-10-07',
            endDate: '2022-01-27',
            isCurrentActivity: true,
          },
          {
            bookingId: 1102484,
            agencyLocationId: 'MDI',
            agencyLocationDescription: 'Moorland (HMP & YOI)',
            description: 'Braille am',
            startDate: '2021-10-07',
            endDate: '2022-01-27',
            isCurrentActivity: false,
          },
        ],
      },
    },
  })

export default {
  getCurrentOffenderActivities,
}
