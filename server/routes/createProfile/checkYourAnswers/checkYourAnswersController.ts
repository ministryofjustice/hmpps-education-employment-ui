import { RequestHandler } from 'express'

import PrisonerProfileService from '../../../services/prisonerProfileService'
import addressLookup from '../../addressLookup'
import yesNoValue from '../../../enums/yesNoValue'
import ProfileStatus from '../../../enums/profileStatus'

export default class CheckYourAnswersController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { prisoner } = req.context

    try {
      // If no record return to rightToWork
      const record = req.session.data[`createProfile_${id}`]
      if (!record) {
        res.redirect(addressLookup.createProfile.rightToWork(id))
        return
      }

      const data = {
        id,
        record,
        prisoner,
      }

      res.render('pages/createProfile/checkYourAnswers/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { prisoner } = req.context

    try {
      // API call to create profile
      const record = req.session.data[`createProfile_${id}`]
      await this.prisonerProfileService.createProfile(res.locals.user.token, {
        prisonerId: id,
        bookingId: prisoner.bookingId,
        status: record.supportOptIn === yesNoValue.YES ? ProfileStatus.SUPPORT_NEEDED : ProfileStatus.SUPPORT_DECLINED,
        currentUser: res.locals.user.username,
        abilityToWork: record.abilityToWork,
        manageDrugsAndAlcohol: record.manageDrugsAndAlcohol,
        alreadyInPlace: record.alreadyInPlace,
        identification: record.identification,
        rightToWork: record.rightToWork,
        supportOptIn: record.supportOptIn,
        supportDeclinedReason: record.supportDeclinedReason,
        supportDeclinedDetails: record.supportDeclinedDetails,
        whatNeedsToChange: record.whatNeedsToChange,
        whatNeedsToChangeDetails: record.whatNeedsToChangeDetails,
        typeOfWork: record.typeOfWork,
        typeOfWorkDetails: record.typeOfWorkDetails,
        jobOfParticularInterest: record.jobOfParticularInterest,
        jobOfParticularInterestDetails: record.jobOfParticularInterestDetails,
        workExperience: record.workExperience,
        workExperienceDetails: record.workExperienceDetails,
        trainingAndQualifications: record.trainingAndQualifications,
        trainingAndQualificationsDetails: record.trainingAndQualificationsDetails,
      })

      // Tidy up record in session
      delete req.session.data[`createProfile_${id}`]

      res.redirect(addressLookup.workProfile(id))
    } catch (err) {
      next(err)
    }
  }
}
