import { defineConfig } from 'cypress'

import { resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import manageUsersApi from './integration_tests/mockApis/manageUsersApi'
import tokenVerification from './integration_tests/mockApis/tokenVerification'
import prisonerSearchApi from './integration_tests/mockApis/prisonerSearchApi'
import esweProfileApi from './integration_tests/mockApis/esweProfileApi'
import nomisUserRolesApi from './integration_tests/mockApis/nomisUserRolesApi'
import prisonApi from './integration_tests/mockApis/prisonApi'
import whereaboutsApi from './integration_tests/mockApis/whereaboutsApi'
import keyworkerApi from './integration_tests/mockApis/keyworkerApi'
import deliusIntegrationApi from './integration_tests/mockApis/deliusIntegrationApi'
import allocationManagerApi from './integration_tests/mockApis/allocationManagerApi'
import jobApi from './integration_tests/mockApis/jobApi'
import jobApplicationApi from './integration_tests/mockApis/jobApplicationApi'
import stubCohortListByReleaseDate from './integration_tests/mockData/cohortListData'
import stubCohortListNameFilter from './integration_tests/mockData/cohortProfileFilterNameData'
import stubCohortListNameNotExistFilter from './integration_tests/mockData/cohortProfileFilterNameNotExistData'
import stubCohortListSortedByLastName from './integration_tests/mockData/cohortListSortedByLastNameData'

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  taskTimeout: 60000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on) {
      on('task', {
        reset: resetStubs,
        ...auth,
        ...manageUsersApi,
        ...tokenVerification,
        ...prisonerSearchApi,
        ...esweProfileApi,
        ...nomisUserRolesApi,
        ...stubCohortListByReleaseDate,
        ...stubCohortListNameFilter,
        ...stubCohortListNameNotExistFilter,
        ...stubCohortListSortedByLastName,
        ...prisonApi,
        ...whereaboutsApi,
        ...keyworkerApi,
        ...allocationManagerApi,
        ...deliusIntegrationApi,
        ...jobApi,
        ...jobApplicationApi,
      })
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
  },
})
