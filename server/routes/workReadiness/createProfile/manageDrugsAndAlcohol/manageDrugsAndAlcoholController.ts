/* eslint-disable no-nested-ternary */
import type { RequestHandler } from 'express'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { plainToClass } from 'class-transformer'

import validateFormSchema from '../../../../utils/validateFormSchema'
import validationSchema from './validationSchema'
import addressLookup from '../../../addressLookup'
import { deleteSessionData, getSessionData, setSessionData } from '../../../../utils/session'
import getBackLocation from '../../../../utils/getBackLocation'
import PrisonerViewModel from '../../../../viewModels/prisonerViewModel'
import ManageDrugsAndAlcoholValue from '../../../../enums/manageDrugsAndAlcoholValue'
import PrisonerProfileService from '../../../../services/prisonerProfileService'
import UpdateProfileRequest from '../../../../data/models/updateProfileRequest'
import workProfileTabs from '../../../../enums/workProfileTabs'
import pageTitleLookup from '../../../../utils/pageTitleLookup'
import config from '../../../../config'

export default class ManageDrugsAndAlcoholController {
  constructor(private readonly prisonerProfileService: PrisonerProfileService) {}

  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { prisoner, profile } = req.context

    try {
      // If no record return to rightToWork
      const record = getSessionData(req, ['createProfile', id])
      if (mode !== 'update' && !record) {
        res.redirect(addressLookup.workReadiness.createProfile.rightToWork(id, mode))
        return
      }

      // Setup back location
      const backLocation = getBackLocation({
        req,
        defaultRoute: addressLookup.workReadiness.createProfile.abilityToWork(id, mode),
        page: 'manageDrugsAndAlcohol',
        uid: id,
      })
      const backLocationAriaText = `Back to ${pageTitleLookup(prisoner, backLocation)}`

      // Setup page data
      const data = {
        backLocation,
        backLocationAriaText,
        prisoner: plainToClass(PrisonerViewModel, prisoner),
        manageDrugsAndAlcohol:
          mode === 'update'
            ? profile.profileData.supportAccepted.workImpacts.ableToManageDependencies
              ? ManageDrugsAndAlcoholValue.ABLE_TO_MANAGE
              : ManageDrugsAndAlcoholValue.NOT_ABLE_TO_MANAGE
            : record.manageDrugsAndAlcohol,
      }

      // Store page data for use if validation fails
      setSessionData(req, ['manageDrugsAndAlcohol', id, 'data'], data)

      res.render('pages/workReadiness/createProfile/manageDrugsAndAlcohol/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { manageDrugsAndAlcohol } = req.body
    const { prisoner, profile } = req.context

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['manageDrugsAndAlcohol', id, 'data'])
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/workReadiness/createProfile/manageDrugsAndAlcohol/index', {
          ...data,
          errors,
        })
        return
      }

      // Handle update
      if (mode === 'update') {
        // Update data model
        profile.profileData.supportAccepted.workImpacts = {
          ...profile.profileData.supportAccepted.workImpacts,
          modifiedBy: res.locals.user.username,
          modifiedDateTime: new Date().toISOString(),
          ableToManageDependencies: manageDrugsAndAlcohol === ManageDrugsAndAlcoholValue.ABLE_TO_MANAGE,
        }

        // Audit edit profile
        if (config.apis.hmppsAudit.enabled) {
          await auditService.sendAuditMessage({
            action: 'EDIT_WORK_PROFILE',
            who: res.locals.user.username,
            subjectType: 'PRISONER_ID',
            subjectId: prisoner.prisonerNumber,
            service: config.apis.hmppsAudit.auditServiceName,
          })
        }

        // Call api, change status
        await this.prisonerProfileService.updateProfile(res.locals.user.token, id, new UpdateProfileRequest(profile))

        // Return to current profile
        const module = getSessionData(req, ['workProfile', id, 'currentModule'], 'wr')
        res.redirect(addressLookup.workProfile(id, workProfileTabs.DETAILS, module))
        return
      }

      // Handle edit and new
      // Update record in sessionData and tidy
      const record = getSessionData(req, ['createProfile', id])
      setSessionData(req, ['createProfile', id], {
        ...record,
        manageDrugsAndAlcohol,
      })
      deleteSessionData(req, ['manageDrugsAndAlcohol', id, 'data'])

      // Redirect to the correct page based on mode
      res.redirect(
        mode === 'new'
          ? addressLookup.workReadiness.createProfile.typeOfWork(id, mode)
          : addressLookup.workReadiness.createProfile.checkAnswers(id),
      )
    } catch (err) {
      next(err)
    }
  }
}
