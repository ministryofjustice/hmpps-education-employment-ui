/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getCurrentOffenderActivitiesResolver'

describe('getCurrentOffenderActivitiesResolver', () => {
  const { req, res, next } = expressMocks()

  req.params.id = 'mock_ref'
  res.locals.user = {}

  const mockData = {
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
  }

  const serviceMock = {
    getAllOffenderActivities: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getAllOffenderActivities.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    serviceMock.getAllOffenderActivities.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.currentOffenderActivities).toEqual([
      {
        bookingId: 1102484,
        agencyLocationId: 'MDI',
        agencyLocationDescription: 'Moorland (HMP & YOI)',
        description: 'Braille am',
        startDate: '2021-10-07',
        endDate: '2022-01-27',
        isCurrentActivity: true,
      },
    ])

    expect(next).toHaveBeenCalledWith()
  })
})
