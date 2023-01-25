/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import middleware from './getLearnerEducationResolver'

describe('getLearnerEducationResolver', () => {
  const { req, res, next } = expressMocks()

  req.params.nomisId = 'mock_ref'

  const mockData = {
    prn: req.params.nomisId,
    establishmentId: 'MDI',
    courseName: 'Dummy_Automated_320',
    courseCode: '008DUM006',
    learningStartDate: '2021-06-01',
    learningPlannedEndDate: '2021-08-06',
    completionStatus:
      'The learner is continuing or intending to continue the learning activities leading to the learning aim',
    withdrawalReasonAgreed: false,
    fundingModel: 'Adult skills',
    fundingType: 'DPS',
    deliveryMethodType: 'Pack only learning - In Cell/Room',
  }

  const serviceMock = {
    getLearnerEducation: jest.fn(),
  }
  const error = new Error('mock_error')

  const resolver = middleware(serviceMock as any)

  it('On error - Calls next with error', async () => {
    serviceMock.getLearnerEducation.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('On error - 404 error - Calls next without error', async () => {
    serviceMock.getLearnerEducation.mockRejectedValue({
      data: {
        status: 404,
        userMessage: 'There is no education data for this prisoner',
      },
    })

    await resolver(req, res, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('On success - Attaches data to context and calls next', async () => {
    serviceMock.getLearnerEducation.mockResolvedValue(mockData)

    await resolver(req, res, next)

    expect(req.context.learnerEducation).toEqual({
      prn: 'mock_ref',
      establishmentId: 'MDI',
      courseName: 'Dummy_Automated_320',
      courseCode: '008DUM006',
      learningStartDate: '2021-06-01',
      learningPlannedEndDate: '2021-08-06',
      completionStatus:
        'The learner is continuing or intending to continue the learning activities leading to the learning aim',
      withdrawalReasonAgreed: false,
      fundingModel: 'Adult skills',
      fundingType: 'DPS',
      deliveryMethodType: 'Pack only learning - In Cell/Room',
    })

    expect(next).toHaveBeenCalledWith()
  })
})
