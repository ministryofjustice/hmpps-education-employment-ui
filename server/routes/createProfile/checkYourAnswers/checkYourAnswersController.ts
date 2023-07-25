import { RequestHandler } from 'express'

import { plainToClass } from 'class-transformer'
import PrisonerProfileService from '../../../services/prisonerProfileService'
import addressLookup from '../../addressLookup'
import yesNoValue from '../../../enums/yesNoValue'
import ProfileStatus from '../../../enums/profileStatus'
import { deleteSessionData, getSessionData } from '../../../utils/session'
import PrisonerViewModel from '../../../viewModels/prisonerViewModel'
import EditProfileRequest from '../../../data/models/editProfileRequest'

export default class CheckYourAnswersController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { prisoner } = req.context

    try {
      // If no record return to rightToWork
      const record = getSessionData(req, ['createProfile', id])
      if (!record) {
        res.redirect(addressLookup.createProfile.rightToWork(id))
        return
      }

      const data = {
        id,
        record,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        statusChange: getSessionData(req, ['changeStatus', id], false),
      }

      res.render('pages/createProfile/checkYourAnswers/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { prisoner, profile } = req.context

    try {
      const record = getSessionData(req, ['createProfile', id])
      const statusChange = getSessionData(req, ['changeStatus', id])

      const newRecord = {
        prisonerId: id,
        bookingId: prisoner.bookingId,
        currentUser: res.locals.user.username,
        abilityToWork: record.abilityToWork,
        manageDrugsAndAlcohol: record.manageDrugsAndAlcohol,
        alreadyInPlace: record.alreadyInPlace,
        identification: record.identification,
        typeOfIdentificationDetails: record.typeOfIdentificationDetails,
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
        prisonName: prisoner.prisonName,
      }

      if (statusChange) {
        // Call api, change status
        await this.prisonerProfileService.updateProfile(
          res.locals.user.token,
          id,
          new EditProfileRequest(
            {
              ...newRecord,
              status: statusChange.newStatus,
            },
            profile,
          ),
        )
      } else {
        // Call api, create profile
        await this.prisonerProfileService.createProfile(res.locals.user.token, {
          ...newRecord,
          status:
            record.supportOptIn === yesNoValue.YES ? ProfileStatus.SUPPORT_NEEDED : ProfileStatus.SUPPORT_DECLINED,
        })
      }

      // Tidy up record in session
      deleteSessionData(req, ['createProfile', id])
      deleteSessionData(req, ['changeStatus', id])

      res.redirect(addressLookup.workProfile(id))
    } catch (err) {
      next(err)
    }
  }
}
