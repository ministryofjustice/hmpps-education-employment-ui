import { Expose, Type } from 'class-transformer'
import ActionsRequiredViewModel from './actionsRequiredViewModel'
import WorkExperienceViewModel from './workExperienceViewModel'
import WorkImpactsViewModel from './workImpactsViewModel'

@Expose()
export default class SupportAcceptedSectionViewModel {
  @Expose()
  @Type(() => ActionsRequiredViewModel)
  actionsRequired: ActionsRequiredViewModel

  @Expose()
  @Type(() => WorkImpactsViewModel)
  workImpacts: WorkImpactsViewModel

  @Expose()
  @Type(() => WorkImpactsViewModel)
  workInterests: WorkImpactsViewModel

  @Expose()
  @Type(() => WorkExperienceViewModel)
  workExperience: WorkExperienceViewModel
}
