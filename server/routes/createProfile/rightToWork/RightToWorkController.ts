import type { RequestHandler } from 'express'
import validateFormSchema from '../../../utils/validateFormSchema'
import validationSchema from './validationSchema'

export default class RightToWorkController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params

    try {
      // Get record in sessionData
      const record = req.session.data[`create_profile_${id}`] || {}

      const data = {
        backLocation: mode ? `/work-profile/${id}` : `/work-profile/create/${id}/check-your-answers`,
        rightToWork: record.rightToWork,
        prisoner: {
          firstName: 'Joe',
          lastName: 'Bloggs',
        },
      }

      // Store page data for use if validation fails
      req.session.data[`rightToWork_${id}_data`] = data

      res.render('pages/createProfile/rightToWork/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const { rightToWork } = req.body

    try {
      // If validation errors render errors
      const data = req.session.data[`rightToWork_${id}_data`]
      const errors = validateFormSchema(req, validationSchema(data))
      if (errors) {
        res.render('pages/createProfile/rightToWork/index', {
          ...data,
          errors,
        })
        return
      }

      // Update record in sessionData
      const record = req.session.data[`create_profile_${id}`] || {}
      req.session.data[`create_profile_${id}`] = {
        ...record,
        rightToWork,
      }

      // If NO redirect to ineligable-to-work
      if (rightToWork === 'NO') {
        res.redirect(`/work-profile/create/${id}/ineligable-to-work`)
        return
      }

      // Redirect to the correct page
      res.redirect(
        mode === 'new'
          ? `/work-profile/create/${id}/right-to-work/${mode}`
          : `/work-profile/create/${id}/check-answers`,
      )
    } catch (err) {
      next(err)
    }
  }
}
