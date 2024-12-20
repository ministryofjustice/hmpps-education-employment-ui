[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-education-employment-ui/tree/main.svg?style=svg)](https://app.circleci.com/pipelines/github/ministryofjustice/hmpps-education-employment-ui?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/ministryofjustice/hmpps-education-employment-ui/badge.svg)](https://snyk.io/test/github/ministryofjustice/hmpps-education-employment-ui)
[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-education-employment-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-education-employment-ui "Link to report")

[![JS](https://img.shields.io/badge/JavaScript-323330?style=flat&logo=javascript&logoColor=F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=fff)](http://www.typescriptlang.org/)
[![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=flat&logo=npm&logoColor=white)](https://www.npmjs.com)
[![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=Node.js&logoColor=fff)](https://nodejs.org/en/)
[![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express)](https://expressjs.com/)
[![Jest](https://img.shields.io/badge/-Jest-C21325?style=postgres&logo=Jest&logoColor=fff)](https://jestjs.io/)
[![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?logo=ESLint&logoColor=fff)](https://eslint.org/)

[![Docker](https://img.shields.io/badge/-Docker-000?logo=docker)](https://www.docker.com)
[![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=flat&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=postgres&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=flat&logo=redis&logoColor=white)](https://redis.io/)

# HMPPS Education employment UI

This is a front-end application used by staff in HMPPS to view and manage work prospects for offenders who
are about to be released.

It is a nodeJS application which by default starts up and listens on URL http://localhost:3000

It is backed up by [hmpps-education-employment-api](https://github.com/ministryofjustice/hmpps-education-employment-api)
which currently acts as a facade to education and skills profile information stored in ESWE's own repository.

# Running locally

The UI application needs a suite of services to work:

|                                      Dependency                                       | Description                                                                                | Default                    | Override Env Var        |
|:-------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------|:---------------------------|:------------------------|
|                                      prison-api                                       | Nomis API providing prisons/offender information                                           | http://localhost:8080      | HMPPS_PRISON_API_URL    |
|                                      hmpps-auth                                       | OAuth2 API server for authenticating requests                                              | http://localhost:9090/auth | HMPPS_AUTH_URL          |
|                                     prison-education-and-delius-api                                     | Delius API to access probation offender details                                            | http://localhost:8083      | DELIUS_INTEGRATION_API_URL       |
|                                    offender-search                                    | Elasticsearch API to find probation offenders                                              | No default                 | PRISONER_SEARCH_URL     |
|                                       postgres                                        | PostgreSQL database server for ESWE                                                        | psql://localhost:5432      | None - required locally |
|                                         redis                                         | Redis cache for user 'session' data (roles)                                                | localhost:6379/tcp         | None - required locally |
|                                 nomis-user-roles-api                                  | Authenticate and retrieve user name & email                                                | http://localhost:8097      | None - required locally |
|                                      curiousApi                                       | Offenders employment, skills and neurodivergence data (3rd party API managed by MegaNexus) | No default                 | None - required locally |
|                                     keyworker-api                                     | Key worker information                                                                     | No default                 | None - required locally |
|                                    whereabouts-api                                    | Offenders location inc. absence figures from activities in prison                          | No default                 | None - required locally |
|                                allocation-manager-api                                 | Allocated POM for offenders                                                                | No default                 | None - required locally |

More information about the template project including features can be
found [here](https://dsdmoj.atlassian.net/wiki/spaces/NDSS/pages/3488677932/Typescript+template+project).

## Roles

### 1. User access
You need to have the following roles assigned to your account (in addition to any other you may have):

* ROLE_EDUCATION_WORK_PLAN_EDITOR
* ROLE_EDUCATION_WORK_PLAN_VIEWER
* ROLE_WORK_READINESS_VIEWER
* ROLE_WORK_READINESS_EDITOR

Secondary roles

* ROLE_JOBS_BOARD_VIEWER - Enables link for jobs board access
* ROLE_JOBS_BOARD_EDITOR - Enables link for jobs board access

### 2. System client id
* ROLE_MAINTAIN_WHEREABOUTS
* ROLE_VIEW_POM_ALLOCATIONS
* ROLE_VIEW_ACTIVITIES
* ROLE_COMMUNITY
* ROLE_PROBATION_API__PRISON_EDUCATION__CASE_DETAIL
* ROLE_NOMIS_ACTIVITIES
* ROLE_VIEW_PRISONER_DATA
* ROLE_MAINTAIN_ACCESS_ROLES
* ROLE_CURIOUS_API
* ROLE_PRISONER_SEARCH

## Requirements

This application is built for node 18 and docker will be needed to run it locally.
[nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm)
can be used to install appropriate node versions.

Additional tools are required to manage deployment: kubectl and helm.

### Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm))

run `nvm install --latest-npm` within the repository folder to use the correct version of node, and the latest version
of npm. This matches the `engines` config in `package.json` and the CircleCI build config.

## Running the app

The easiest way to run the app is to use docker compose to create the service and all dependencies.

The app requires:

* hmpps-auth - for authentication
* redis - session store and token caching

### Running the app in `dev` environment

This is probably the easiest way to run and develop on your machine: by hooking into services that already exist
in the `dev` environment.
A user account is needed in hmpps-auth with the appropriate roles.

Create a `.env` file and complete the following values:

| Environment variable            | Value                                                                              |
|:--------------------------------|:-----------------------------------------------------------------------------------|
| API_CLIENT_ID                   | _<your client id>_                                                                 |
| API_CLIENT_SECRET               | _<your client id secret>_                                                          |
| SYSTEM_CLIENT_ID                |                                                                                    |
| SYSTEM_CLIENT_SECRET            |                                                                                    |
| DPS_URL                         | https://digital-dev.prison.service.justice.gov.uk                                  |
| SUPPORT_URL                     | https://support-dev.hmpps.service.justice.gov.uk                                   |
| HMPPS_AUTH_URL                  | https://sign-in-dev.hmpps.service.justice.gov.uk/auth                              |
| HMPPS_PRISON_API_URL            | https://prison-api-dev.prison.service.justice.gov.uk                               |
| NOMIS_USER_ROLES_API_URL        | https://nomis-user-roles-api-dev.prison.service.justice.gov.uk                     |
| TOKEN_VERIFICATION_API_URL      | https://token-verification-api-dev.prison.service.justice.gov.uk                   |
| DELIUS_INTEGRATION_API_URL      | https://prison-education-and-delius-dev.hmpps.service.justice.gov.uk               |
| CURIOUS_API_URL                 | https://testservices.sequation.net/sequation-virtual-campus2-api/                  |
| ESWE_PROFILE_API_URL            | https://education-employment-api-dev.hmpps.service.justice.gov.uk                  |
| PRISONER_SEARCH_URL             | https://prisoner-search-dev.prison.service.justice.gov.uk                          |
| KEYWORKER_API_URL               | https://keyworker-api-dev.prison.service.justice.gov.uk                            |
| WHEREABOUTS_API_URL             | https://whereabouts-api-dev.service.justice.gov.uk                                 |
| ALLOCATION_MANAGER_ENDPOINT_URL | https://allocation-manager-staging.apps.live.cloud-platform.service.justice.gov.uk |
| SYSTEM_PHASE                    | DEV                                                                                |
| WEEKS_BEFORE_RELEASE            | 12                                                                                 |
| COMPONENT_API_URL               | https://frontend-components-dev.hmpps.service.justice.gov.uk                       |
| JOB_API_URL                     | https://jobs-board-api-dev.hmpps.service.justice.gov.uk                            |
| JOB_UPLOAD_URL                  | https://jobs-board-dev.hmpps.service.justice.gov.uk                                |
| REPORTING_URL                   | https://jobs-board-reporting-dev.hmpps.service.justice.gov.uk                      |
| MANAGE_USERS_API                | https://manage-users-api-dev.hmpps.service.justice.gov.uk                          |
| GET_SOMEONE_READY_FOR_WORK_URL  | https://get-ready-for-work-dev.hmpps.service.justice.gov.uk                        |

There are several feature toggles that can be used to toggle functionality on and off

|:--------------------------------------------------------------------------------------------------------------------------:|
| Feature toggles                                                                                                            |
|:--------------------------------------------------------------------------------------------------------------------------:|
| CANDIDATE_MATCHING_ENABLED - Enables all Work after leaving prison and candidate matching functionality, changes homepage to menu |
| ARCHIVED_JOBS_ENABLED - Enables all archive jobs views and functions                                                       |
| EXPRESSIONS_OF_INTEREST_ENABLED - Enables all expressions of interest views                                                |
| TOGGLE_ARCHIVED_JOBS_ENABLED - Enables the toggling of archive status for development and testing                          |
| TOGGLE_EXPRESSIONS_OF_INTEREST_ENABLED - Enables toggling of expression of interest for development and testing            |
| JOB_APPLICATIONS_ENABLED - Toggles all job applications functions and views                                                |
| REPORTING_LINK_ENABLED - Enables reporting link on Work after leaving prison homepage                                             |
|:--------------------------------------------------------------------------------------------------------------------------:|

Run the application in development mode, in separate shell sessions:

```shell
docker-compose pull

docker-compose up --scale=app=0

npm install (to install all required dependencies)
```

This will automatically restart it if server code or front-end assets are modified.

#### Run tests

`npm run test`

And then, to build the assets and start the app with nodemon:

`npm run start:dev`

Point your browser at http://localhost:3000 to login or http://localhost:3000/health to see application and dependency
health.

### Environment variables

In config.ts you can see all the required variables.
These are set with defaults that will allow the application to run locally.
You can override these (as per the examples above), or provide `.env` file containing these.

The environment variables supplied to the service in `dev`, `preprod` and `prod` are setup in the `
helm_deploy/hmpps-education-employment-ui` folder.
Some of these are supplied as is, and some are secret values provided by the target environment.
The public values are provided in the files:

- values-dev.yml
- values-preprod.yml
- values-prod.yml

The secret values are referenced in the `helm_deploy/hmpps-education-employment-ui/values.yaml`, but the values are
pulled from AWS secrets at deployment time by the circle CI jobs - they are never committed into the Git repository.

### Running integration tests

Run the full set of headless integration tests, in separate shell sessions:

```shell
docker compose -f docker-compose-test.yml up
npm run start-feature
npm run int-test
```

Integration tests can also be run in development mode with a UI
so that assets are rebuilt when modified and tests will re-run:

```shell
docker compose -f docker-compose-test.yml up
npm run start-feature:dev
npm run int-test-ui
```

### Code style tests

Prettier should automatically correct many stylistic errors when changes are committed,
but the linter can also be run manually:

```shell
npm run lint
```

### Security tests

Continuous integration will regularly perform security checks using nm security audit, trivy and veracode.

The npm audit can be run manually:

```shell
npx audit-ci --config audit-ci.json
```

### Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`

### Prototype

- [website](https://hmpps-prisoner-education.apps.live.cloud-platform.service.justice.gov.uk/)

Get Username/Password from the team.

## Hosting

This application is hosted on [Cloud Platform](https://user-guide.cloud-platform.service.justice.gov.uk/)
in three environments, which are distinct namespaces defined using a combination of kubernetes resources and terraform
templates:

* [`dev`](https://github.com/ministryofjustice/cloud-platform-environments/tree/main/namespaces/live.cloud-platform.service.justice.gov.uk/hmpps-education-employment-dev):
  continuously deployed and experimental; for general testing
* [`preprod`](https://github.com/ministryofjustice/cloud-platform-environments/tree/main/namespaces/live.cloud-platform.service.justice.gov.uk/hmpps-education-employment-preprod):
  largely matches the live service; for pre-release testing
* [`prod`](https://github.com/ministryofjustice/cloud-platform-environments/tree/main/namespaces/live.cloud-platform.service.justice.gov.uk/hmpps-education-employment-prod):
  the live service

A shared HMPPS helm chart forms the basis of releases,
setting up a deployment, service, ingress and associated policies and monitoring rules.

See `/helm_deploy/`.

### Deployment

When the main branch is updated (e.g. when a pull request is merged),
a new version of the application is released to `dev` automatically by CircleCI.
This release can be promoted to `preprod` and `prod` using the CircleCI interface.

See `/helm_deploy/README.md` for manual deployment steps.

### Monitoring

There is a suite of tools used for monitoring deployed applications:

* [Kibana](https://kibana.cloud-platform.service.justice.gov.uk/_plugin/kibana/app/kibana) – logging
* [Azure Application Insights](https://portal.azure.com/) – application profiling and introspection

## References

The code in this repository uses the MIT licence.

* [MoJ security guidance](https://security-guidance.service.justice.gov.uk/)
* [MoJ technical guidance](https://technical-guidance.service.justice.gov.uk/)

### For Info Only

Examples to check the job is running, and see what pods have been created (`dev`):

`kubectl --context live.cloud-platform.service.justice.gov.uk -n hmpps-education-employment-dev get pods`

Get the logs from the pod:

`kubectl -n hmpps-education-employment-dev logs [pod name]`
