/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getNeurodivergenceResolver'

import { NeurodivergenceSupport } from '../../data/curious/types/Enums'

describe('getNeurodivergenceResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  req.params.id = 'mock_ref'

  const mockData = {
    prn: req.params.id,
    establishmentId: 'MDI',
    establishmentName: 'HMP Moorland',
    neurodivergenceSupport: [NeurodivergenceSupport.MemorySupport, NeurodivergenceSupport.Reading],
  }

  const serviceMock = {
    getLearnerNeurodivergence: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getLearnerNeurodivergence.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On error - 404 error - Calls next without error', async () => {
    serviceMock.getLearnerNeurodivergence.mockRejectedValue({
      data: {
        status: 404,
        userMessage: 'There is no neurodivergence data for this prisoner',
      },
    })

    await resolver(req, res, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('On success - Attaches data to context and calls next', async () => {
    serviceMock.getLearnerNeurodivergence.mockResolvedValue(mockData.neurodivergenceSupport)

    await resolver(req, res, next)

    expect(req.context.neurodivergence).toEqual([NeurodivergenceSupport.MemorySupport, NeurodivergenceSupport.Reading])

    expect(next).toHaveBeenCalledWith()
  })
})
