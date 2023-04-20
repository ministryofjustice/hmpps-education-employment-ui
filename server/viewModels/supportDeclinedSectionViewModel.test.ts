import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import SupportDeclinedSectionViewModel from './supportDeclinedSectionViewModel'

describe('SupportDeclinedSectionViewModel', () => {
  const supportJson = {
    modifiedBy: 'testuser',
    modifiedDateTime: '2022-04-19T12:35:00Z',
    supportToWorkDeclinedReason: ['reason1', 'reason2'],
    supportToWorkDeclinedReasonOther: 'other reason',
    circumstanceChangesRequiredToWork: ['change1', 'change2'],
    circumstanceChangesRequiredToWorkOther: 'other change',
  }

  it('transforms JSON to SupportDeclinedSectionViewModel instance', () => {
    const supportViewModel = plainToClass(SupportDeclinedSectionViewModel, supportJson)

    expect(supportViewModel.modifiedBy).toBe(supportJson.modifiedBy)
    expect(supportViewModel.modifiedDateTime).toBe('19 April')
    expect(supportViewModel.supportToWorkDeclinedReason).toStrictEqual(supportJson.supportToWorkDeclinedReason)
    expect(supportViewModel.supportToWorkDeclinedReasonOther).toBe(supportJson.supportToWorkDeclinedReasonOther)
    expect(supportViewModel.circumstanceChangesRequiredToWork).toStrictEqual(
      supportJson.circumstanceChangesRequiredToWork,
    )
    expect(supportViewModel.circumstanceChangesRequiredToWorkOther).toBe(
      supportJson.circumstanceChangesRequiredToWorkOther,
    )
  })
})
