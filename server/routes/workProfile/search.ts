import type { ValidationResult } from 'joi'
import joi, { date } from 'joi'
import { isNil } from 'ramda'
import type { RequestHandler } from 'express'
import { plainToClass } from 'class-transformer'
import { format as formatDate } from 'date-fns'
import type PrisonerSearchService from '../../services/prisonSearchService'
import PaginationService from '../../services/paginationServices'
import { twelveWeeksFromNow, formatDateToyyyyMMdd } from '../../utils/utils'

const format = (date: Date) => date && formatDate(date, 'yyyy-MM-dd')

export default class SearchRoutes {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly paginationService: PaginationService,
  ) {}

  private searchSchema = joi.object({
    searchTerm: joi.string().trim().min(3).required().messages({
      'string.empty': 'Enter at least three characters',
      'string.min': 'Enter at least three characters',
    }),
  })

  public commonSearch: RequestHandler = async (req, res): Promise<void> => {
    const { searchTerm } = req.body

    if (searchTerm.length > 0) {
      const errorKeys = ['#searchTerm', '#numberSearch']
      const errors = [{ text: 'Enter only one search term' }]
      res.render('pages/workProfile/viewWorkProfile', { searchTerm, errors, errorKeys })
      return
    }

    if (searchTerm.length > 0) {
      res.redirect(`/work-profile?searchTerm=${searchTerm}`)
      return
    }

    const errorKeys = ['#searchTerm']
    const errors = [{ text: 'Enter at least three characters' }]
    res.render('pages/workProfile/viewWorkProfile', { errors, errorKeys })
  }

  // TODO: REFACTOR + VALIDATE!!
  public prisonerSearch: RequestHandler = async (req, res): Promise<void> => {
    const { searchTerm, status, offenderName, page } = req.query

    // if (isNil(searchTerm)) {
    //   res.render('pages/workProfile/viewWorkProfile')
    //   return
    // }
    const pageNumber = page ? +page - 1 : 0

    // const validationResult = this.searchSchema.validate(req.query, { stripUnknown: true, abortEarly: false })
    //
    // if (validationResult.error) {
    //   const { errors, errorKeys } = this.getSearchScreenErrors(validationResult, '#searchTerm')
    //   res.render('pages/workProfile/viewWorkProfile', { searchTerm, errors, errorKeys })
    //   return
    // }

    const results = await this.prisonerSearchService.search({
      searchTerm: 'smith',
      user: res.locals.user,
      pageNumber,
    })

    const paginationUrl = new URL(`${req.protocol}://${req.get('host')}/work-profile?searchTerm=${searchTerm}&page=0`)
    const paginationData = this.paginationService.getPagination(results, paginationUrl)

    res.render('pages/workProfile/viewWorkProfile', { searchTerm, prisonerSearchResults: results, paginationData })
  }

  // TODO: REFACTOR + VALIDATE!!!
  public prisonerSearchByReleaseDate: RequestHandler = async (req, res): Promise<void> => {
    const { searchTerm, prisonIds, page } = req.query

    // if (isNil(searchTerm)) {
    //   res.render('pages/workProfile/viewWorkProfile')
    //   return
    // }
    const pageNumber = page ? +page - 1 : 0

    // const validationResult = this.searchSchema.validate(req.query, { stripUnknown: true, abortEarly: false })

    // if (validationResult.error) {
    //   const { errors, errorKeys } = this.getSearchScreenErrors(validationResult, '#searchTerm')
    //   res.render('pages/workProfile/viewWorkProfile', { searchTerm, errors, errorKeys })
    //   return
    // }

    const dateFilter = `${twelveWeeksFromNow()},${formatDateToyyyyMMdd(new Date())}`

    /*
      TODO
      This is a 1st stab at populating main screen, parameters are hard-coded here for that
      purpose. MUST BE REFACTORED!!
      Retrieve caseload from prisonSearchService to determine prison ids?!
     */
    const results = await this.prisonerSearchService.searchByReleaseDate(
      res.locals.user.username,
      dateFilter,
      ['LEI', 'MDI'],
      res.locals.user.token,
    )

    const paginationUrl = new URL(`${req.protocol}://${req.get('host')}/work-profile/viewWorkProfile`)
    const paginationData = this.paginationService.getPagination(results, paginationUrl)

    res.render('pages/workProfile/viewWorkProfile', { prisonerSearchResults: results, paginationData })
  }

  private getSearchScreenErrors(validationResult: ValidationResult, pageErrorKey: string) {
    const errors = validationResult.error.details.map(details => ({
      text: details.message,
      href: `#${details.context.key}`,
    }))

    const errorKeys = [pageErrorKey]
    return { errors, errorKeys }
  }
}
