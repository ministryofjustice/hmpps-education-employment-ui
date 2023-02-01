import { stubFor } from '../mockApis/wiremock'

const getTestCohortNameExists = {
  content: [
    {
      prisonerNumber: 'A7880DY',
      bookingId: '1201384',
      bookNumber: '38617A',
      firstName: 'TONY',
      lastName: 'VENTOUR',
      dateOfBirth: '2001-08-04',
      gender: 'Male',
      ethnicity: 'Mixed: White and Black African',
      youthOffender: false,
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'I',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: '4-1-013',
      aliases: [],
      alerts: [],
      category: 'C',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'SENT03',
      imprisonmentStatusDescription: 'Adult Imprisonment Without Option CJA03',
      mostSeriousOffence: 'Robbery',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2021-08-04',
      releaseDate: '2023-05-05',
      sentenceExpiryDate: '2025-02-03',
      licenceExpiryDate: '2025-02-03',
      homeDetentionCurfewEligibilityDate: '2022-12-22',
      nonDtoReleaseDate: '2023-05-05',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2021-08-04',
      conditionalReleaseDate: '2023-05-05',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
    },
  ],
}

const stubCohortListNameFilter = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/prisoner-search/release-date-by-prison?lastName=ventour&page=0&size=2000',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        ...getTestCohortNameExists,
      },
    },
  })

export default { stubCohortListNameFilter }
