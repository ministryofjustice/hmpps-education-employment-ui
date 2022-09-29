import type { RequestHandler } from 'express'
import schema from './validationSchema'

export default class RightToWorkController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, mode } = req.params
    const q = req.query

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

      req.session.data[`rightToWork_${id}_data`] = data

      res.render('pages/createProfile/rightToWork/index', data)
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { id } = req.params
    const { rightToWork } = req.body

    try {
      const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })
      console.log(error)
      if (error.details) {
        console.log(error.details)

        const displayError = error.details.reduce((acc, current) => {
          const { key } = current.context
          acc[key] = {
            text: current.message,
          }
          return acc
        }, {})

        console.log(displayError)

        res.render('pages/createProfile/rightToWork/index', {
          ...req.session.data[`rightToWork_${id}_data`],
          error: displayError,
        })
        return
      }

      // Update record in sessionData
      const record = req.session.data[`create_profile_${id}`] || {}
      req.session.data[`create_profile_${id}`] = {
        ...record,
        rightToWork,
      }

      // Redirect to the correct page
      const nextPage =
        rightToWork === 'YES'
          ? `/work-profile/create/${id}/right-to-work`
          : `/work-profile/create/${id}/ineligable-to-work`
      res.redirect(nextPage)
    } catch (err) {
      next(err)
    }
  }
}
