/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getLatestAssessmentResolver'

describe('getLatestAssessmentResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  req.params.id = 'mock_ref'

  const mockData = {
    prn: req.params.id,
    qualifications: [
      {
        establishmentId: 'WDI',
        establishmentName: 'WAKEFIELD (HMP)',
        qualification: {
          qualificationType: 'English',
          qualificationGrade: 'Level 1',
          assessmentDate: '2021-05-03',
        },
      },
    ],
  }

  const serviceMock = {
    getLearnerLatestAssessment: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getLearnerLatestAssessment.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On error - 404 error - Calls next without error', async () => {
    serviceMock.getLearnerLatestAssessment.mockRejectedValue({
      data: {
        status: 404,
        userMessage: 'There is no assessment data for this prisoner',
      },
    })

    await resolver(req, res, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('On success - Attaches data to context and calls next', async () => {
    serviceMock.getLearnerLatestAssessment.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.learnerLatestAssessment).toEqual({
      prn: 'mock_ref',
      qualifications: [
        {
          establishmentId: 'WDI',
          establishmentName: 'WAKEFIELD (HMP)',
          qualification: {
            qualificationType: 'English',
            qualificationGrade: 'Level 1',
            assessmentDate: '2021-05-03',
          },
        },
      ],
    })

    expect(next).toHaveBeenCalledWith()
  })
})
