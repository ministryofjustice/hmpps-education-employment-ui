import ProfileStatus from '../../../enums/profileStatus'
import SupportAcceptedSection from './supportAcceptedSection'
import SupportDeclinedSection from './supportDeclinedSection'

export default interface ProfileDataSection {
  status: ProfileStatus

  prisonName?: string

  supportDeclined?: SupportDeclinedSection

  supportAccepted?: SupportAcceptedSection
}
