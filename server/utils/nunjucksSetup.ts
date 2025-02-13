/* eslint-disable */
import nunjucks from 'nunjucks'
import express from 'express'
import * as pathModule from 'path'
import config from '../config'
import { decryptUrlParameter, encryptUrlParameter } from './urlParameterEncryption'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, path: pathModule.PlatformPath): void {
  app.set('view engine', 'njk')

  app.locals.dpsHomeUrl = config.dpsHomeUrl
  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Work after leaving prison'
  app.locals.googleAnalyticsId = config.googleAnalytics.googleAnalyticsId

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
      'node_modules/govuk-frontend/dist',
      'node_modules/govuk-frontend/dist/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
      'node_modules/@ministryofjustice/hmpps-connect-dps-components/dist/assets/',
    ],
    {
      autoescape: true,
      express: app,
    }
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
      }))
  )

  njkEnv.addFilter('fixed', (num: number, length: number) => {
    return num.toFixed(length || 2)
  })

  njkEnv.addGlobal('dpsUrl', config.dpsHomeUrl)
  njkEnv.addGlobal('phaseName', config.phaseName)
  njkEnv.addGlobal('encryptUrlParameter', encryptUrlParameter)
  njkEnv.addGlobal('decryptUrlParameter', decryptUrlParameter)
  njkEnv.addGlobal('googleTagManagerContainerId', config.googleAnalytics.containerId)
}
