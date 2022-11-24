export function getTestCohortSupportNeeded() {
  return {
    content: [
      {
        prisonerNumber: 'A8592DY',
        bookingId: '1202136',
        bookNumber: '39242A',
        firstName: 'BRUNO',
        lastName: 'MARS',
        dateOfBirth: '1970-01-01',
        gender: 'Male',
        youthOffender: false,
        status: 'ACTIVE IN',
        lastMovementTypeCode: 'ADM',
        lastMovementReasonCode: 'TRNCRT',
        inOutStatus: 'IN',
        prisonId: 'MDI',
        prisonName: 'Moorland (HMP & YOI)',
        cellLocation: '1-3-003',
        aliases: [],
        alerts: [],
        legalStatus: 'SENTENCED',
        imprisonmentStatus: 'ADIMP_ORA20',
        imprisonmentStatusDescription: 'ORA 2020 Standard Determinate Sentence',
        mostSeriousOffence: 'Drive vehicle for more than 13 hours or more in a working day - domestic',
        recall: false,
        indeterminateSentence: false,
        sentenceStartDate: '2022-04-08',
        releaseDate: '2023-04-08',
        sentenceExpiryDate: '2024-04-07',
        licenceExpiryDate: '2024-04-07',
        homeDetentionCurfewEligibilityDate: '2022-11-25',
        nonDtoReleaseDate: '2023-04-08',
        nonDtoReleaseDateType: 'CRD',
        receptionDate: '2022-04-08',
        conditionalReleaseDate: '2023-04-08',
        locationDescription: 'Moorland (HMP & YOI)',
        restrictedPatient: false,
      },
    ],
  }
}

export default { getTestCohortSupportNeeded }

// const stubCohortListSupportNeeded = () =>
//   stubFor({
//     request: {
//       method: 'POST',
//       url: '/prisoner-search/release-date-by-prison?status=SUPPORT_NEEDED&searchTerm=&page=0&size=2000',
//     },
//     response: {
//       status: 200,
//       headers: { 'Content-Type': 'application/json;charset=UTF-8' },
//       jsonBody: {
//         ...getTestCohortSupportNeeded,
//       },
//     },
//   })
//
// export default stubCohortListSupportNeeded
