/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getUnacceptableAbsenceCountResolver'

describe('getUnacceptableAbsencesCountResolver', () => {
  const { req, res, next } = expressMocks()

  req.params.id = 'mock_ref'
  res.locals.user = {}

  const mockData = {
    acceptableAbsence: 0,
    unacceptableAbsence: 2,
    total: 4,
  }

  const serviceMock = {
    getUnacceptibleAbsenceCount: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getUnacceptibleAbsenceCount.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    serviceMock.getUnacceptibleAbsenceCount.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.unacceptableAbsenceCount).toEqual({
      acceptableAbsence: 0,
      unacceptableAbsence: 2,
      total: 4,
    })

    expect(next).toHaveBeenCalledWith()
  })
})
