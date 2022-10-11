/* eslint-disable no-param-reassign */
import nunjucks from 'nunjucks'
import express from 'express'
import * as pathModule from 'path'
import querystring from 'querystring'
import config from '../config'
import { PageMetaData } from './page'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, path: pathModule.PlatformPath): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Hmpps Education Employment Ui'

  // Cachebusting version string
  if (production) {
    // Version only changes on reboot
    app.locals.version = Date.now().toString()
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/',
      'node_modules/govuk-frontend/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('initialiseName', (fullName: string) => {
    // this check is for the authError page
    if (!fullName) {
      return null
    }
    const array = fullName.split(' ')
    return `${array[0][0]}. ${array.reverse()[0]}`
  })

  njkEnv.addFilter('findError', (array, formFieldId) => {
    if (!array) return null
    const item = array.find((error: { href: string }) => error.href === `#${formFieldId}`)
    if (item) {
      return {
        text: item.text,
      }
    }
    return null
  })

  njkEnv.addFilter(
    'setSelected',
    (items, selected) =>
      items &&
      items.map((entry: { value: any }) => ({
        ...entry,
        selected: entry && entry.value === selected,
      })),
  )

  njkEnv.addFilter('toPagination', (pageData: PageMetaData, query: Record<string, unknown> = {}) => {
    const urlForPage = (n: any) => `?${querystring.stringify({ ...query, page: n })}`
    const items = [...Array(pageData.totalPages).keys()].map(n => ({
      text: n + 1,
      href: urlForPage(n + 1),
      selected: n + 1 === pageData.page,
    }))
    return {
      results: {
        from: pageData.min,
        to: pageData.max,
        count: pageData.totalCount,
      },
      previous: pageData.previousPage && {
        text: 'Previous',
        href: urlForPage(pageData.previousPage),
      },
      next: pageData.nextPage && {
        text: 'Next',
        href: urlForPage(pageData.nextPage),
      },
      items,
    }
  })

  njkEnv.addGlobal('dpsUrl', config.dpsHomeUrl)
}
