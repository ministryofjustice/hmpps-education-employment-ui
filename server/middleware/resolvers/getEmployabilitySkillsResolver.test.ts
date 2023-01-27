/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getEmployabilitySkillsResolver'

describe('getEmployabilitySkillsResolver', () => {
  const { req, res, next } = expressMocks()

  req.params.id = 'mock_ref'

  const mockData = {
    prn: req.params.id,
    establishmentId: 'MDI',
    establishmentName: 'MOORLAND (HMP & YOI)',
    employabilitySkill: 'Problem Solving',
    activityLocation: 'DPS',
    reviews: [
      {
        reviewDate: '2022-01-04',
        currentProgression: '4 - Good demonstration - Substantial evidence provided',
        comment: 'mock_comment',
      },
    ],
  }

  const serviceMock = {
    getLearnerEmployabilitySkills: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getLearnerEmployabilitySkills.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On error - 404 error - Calls next without error', async () => {
    serviceMock.getLearnerEmployabilitySkills.mockRejectedValue({
      data: {
        status: 404,
        userMessage: 'There is no employability skills data for this prisoner',
      },
    })

    await resolver(req, res, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('On success - Attaches data to context and calls next', async () => {
    serviceMock.getLearnerEmployabilitySkills.mockResolvedValue(mockData.reviews)

    await resolver(req, res, next)

    expect(req.context.employabilitySkills).toEqual([
      {
        reviewDate: '2022-01-04',
        currentProgression: '4 - Good demonstration - Substantial evidence provided',
        comment: 'mock_comment',
      },
    ])

    expect(next).toHaveBeenCalledWith()
  })
})
