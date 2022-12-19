import { Exclude, Expose, Type } from 'class-transformer'

import ProfileStatus from '../enums/profileStatus'
import SupportAcceptedSectionViewModel from './supportAcceptedSectionViewModel'
import SupportDeclinedSectionViewModel from './supportDeclinedSectionViewModel'

@Exclude()
export default class ProfileDataSectionViewModel {
  @Expose()
  status: ProfileStatus

  @Expose()
  @Type(() => SupportDeclinedSectionViewModel)
  supportDeclined?: SupportDeclinedSectionViewModel

  @Expose()
  @Type(() => SupportAcceptedSectionViewModel)
  supportAccepted?: SupportAcceptedSectionViewModel
}
