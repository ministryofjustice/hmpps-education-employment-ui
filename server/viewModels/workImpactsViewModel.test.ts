import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import WorkImpactsViewModel from './workImpactsViewModel'

describe('WorkImpactsViewModel', () => {
  const viewModelJson = {
    modifiedBy: 'John Doe',
    modifiedDateTime: '2022-12-31T23:59:59Z',
    abilityToWorkImpactedBy: ['Physical health', 'Mental health'],
    caringResponsibilitiesFullTime: true,
    ableToManageMentalHealth: false,
    ableToManageDependencies: true,
  }

  it('transforms JSON to WorkImpactsViewModel instance', () => {
    const viewModel = plainToClass(WorkImpactsViewModel, viewModelJson)

    expect(viewModel.modifiedBy).toBe(viewModelJson.modifiedBy)
    expect(viewModel.modifiedDateTime).toBe('31 December')
    expect(viewModel.abilityToWorkImpactedBy).toEqual(viewModelJson.abilityToWorkImpactedBy)
    expect(viewModel.caringResponsibilitiesFullTime).toBe(viewModelJson.caringResponsibilitiesFullTime)
    expect(viewModel.ableToManageMentalHealth).toBe(viewModelJson.ableToManageMentalHealth)
    expect(viewModel.ableToManageDependencies).toBe(viewModelJson.ableToManageDependencies)
  })
})
