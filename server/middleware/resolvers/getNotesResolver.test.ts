/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getNotesResolver'

describe('getNotesResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = {}
  req.id = 'mock_ref'

  const mockData = {
    notes: [
      {
        text: 'mock_text',
        createdBy: 'MOCK_USER',
      },
    ],
    user: {
      name: 'Mock User',
    },
  }

  const serviceMock = {
    getNotes: jest.fn(),
    getUserByUsername: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any, serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getNotes.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and call next', async () => {
    serviceMock.getNotes.mockResolvedValue(mockData.notes)
    serviceMock.getUserByUsername.mockResolvedValue(mockData.user)

    await resolver(req, res, next)

    expect(req.context.notes).toEqual([
      {
        createdBy: 'MOCK_USER',
        createdName: 'Mock User',
        text: 'mock_text',
      },
    ])
    expect(next).toHaveBeenCalledWith()
  })
})
