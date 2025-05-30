import { stubFor } from '../mockApis/wiremock'

const getTestSortedCohortData = {
  content: [
    {
      prisonerNumber: 'G6190UD',
      pncNumber: '82/17882J',
      pncNumberCanonicalShort: '82/17882J',
      pncNumberCanonicalLong: '1982/17882J',
      croNumber: '17882/82W',
      bookingId: '1155279',
      bookNumber: '06107A',
      firstName: 'CURT',
      lastName: 'DOOL',
      dateOfBirth: '1965-03-24',
      gender: 'Male',
      ethnicity: 'White: Eng./Welsh/Scot./N.Irish/British',
      youthOffender: false,
      religion: 'No Religion',
      nationality: 'British',
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'INT',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: '4-1-038',
      aliases: [],
      alerts: [
        {
          alertType: 'R',
          alertCode: 'RCS',
          active: true,
          expired: false,
        },
        {
          alertType: 'C',
          alertCode: 'CC1',
          active: true,
          expired: false,
        },
        {
          alertType: 'S',
          alertCode: 'SC',
          active: true,
          expired: false,
        },
        {
          alertType: 'O',
          alertCode: 'OHCO',
          active: true,
          expired: false,
        },
      ],
      csra: 'Standard',
      category: 'C',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'LASPO_DR',
      imprisonmentStatusDescription: 'EDS LASPO Discretionary Release',
      mostSeriousOffence: 'GROSS INDECENCY WITH A CHILD',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2017-01-02',
      releaseDate: '2023-03-14',
      confirmedReleaseDate: '2023-03-14',
      sentenceExpiryDate: '2024-01-22',
      licenceExpiryDate: '2023-12-31',
      nonDtoReleaseDate: '2023-01-14',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2016-12-01',
      paroleEligibilityDate: '2020-12-29',
      conditionalReleaseDate: '2023-01-14',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
    },
    {
      prisonerNumber: 'A8291DY',
      bookingId: '1201831',
      bookNumber: '38940A',
      firstName: 'MOCKSUE',
      lastName: 'MOCKUSER',
      dateOfBirth: '1970-01-01',
      gender: 'Female',
      youthOffender: false,
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'N',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: '1-3-004',
      aliases: [],
      alerts: [],
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'ADIMP_ORA20',
      imprisonmentStatusDescription: 'ORA 2020 Standard Determinate Sentence',
      mostSeriousOffence: 'Drive vehicle for more than 13 hours or more in a working day - domestic',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2022-01-28',
      releaseDate: '2023-03-02',
      sentenceExpiryDate: '2024-04-03',
      licenceExpiryDate: '2024-04-03',
      homeDetentionCurfewEligibilityDate: '2022-10-19',
      nonDtoReleaseDate: '2023-03-02',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2022-01-28',
      conditionalReleaseDate: '2023-03-02',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
    },
    {
      prisonerNumber: 'A8321DY',
      bookingId: '1201857',
      bookNumber: '38963A',
      firstName: 'DEEPAK',
      lastName: 'HOODA',
      dateOfBirth: '1981-03-02',
      gender: 'Male',
      youthOffender: false,
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: '24',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: 'RECV',
      aliases: [],
      alerts: [],
      category: 'B',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'SENT03',
      imprisonmentStatusDescription: 'Adult Imprisonment Without Option CJA03',
      mostSeriousOffence: 'Conspire to supply a class A controlled drug - heroin',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2021-03-26',
      releaseDate: '2023-03-26',
      sentenceExpiryDate: '2025-03-25',
      licenceExpiryDate: '2025-03-25',
      nonDtoReleaseDate: '2023-03-26',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2021-03-26',
      conditionalReleaseDate: '2023-03-26',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
    },
    {
      prisonerNumber: 'A8592DY',
      bookingId: '1202136',
      bookNumber: '39242A',
      firstName: 'MOCKSUE2',
      lastName: 'MOCKUSER2',
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
    {
      prisonerNumber: 'G5492UQ',
      pncNumber: '14/337442X',
      pncNumberCanonicalShort: '14/337442X',
      pncNumberCanonicalLong: '2014/337442X',
      croNumber: '321510/14H',
      bookingId: '874591',
      bookNumber: 'M52341',
      firstName: 'CREIGHTON',
      middleNames: 'JULINEE',
      lastName: 'MOCKUSER3',
      dateOfBirth: '1976-04-29',
      gender: 'Male',
      ethnicity: 'Asian/Asian British: Pakistani',
      youthOffender: false,
      maritalStatus: 'Male',
      religion: 'Religion - Muslim',
      nationality: 'Spaniard',
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'INT',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: '4-1-037',
      aliases: [
        {
          firstName: 'IBOATAAHIM',
          middleNames: 'CAMDYN',
          lastName: 'TAYLABETH',
          dateOfBirth: '1976-04-24',
          gender: 'Male',
        },
      ],
      alerts: [
        {
          alertType: 'T',
          alertCode: 'TAH',
          active: true,
          expired: false,
        },
        {
          alertType: 'X',
          alertCode: 'XNR',
          active: true,
          expired: false,
        },
        {
          alertType: 'P',
          alertCode: 'PL1',
          active: true,
          expired: false,
        },
        {
          alertType: 'R',
          alertCode: 'ROH',
          active: true,
          expired: false,
        },
        {
          alertType: 'P',
          alertCode: 'PVN',
          active: true,
          expired: false,
        },
        {
          alertType: 'S',
          alertCode: 'SR',
          active: true,
          expired: false,
        },
      ],
      csra: 'Standard',
      category: 'C',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'SENT03',
      imprisonmentStatusDescription: 'Adult Imprisonment Without Option CJA03',
      mostSeriousOffence: 'Rape a woman 16 years of    age or over - SOA 2003',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2014-12-18',
      releaseDate: '2022-12-03',
      confirmedReleaseDate: '2022-12-03',
      sentenceExpiryDate: '2031-07-02',
      licenceExpiryDate: '2031-07-03',
      nonDtoReleaseDate: '2023-01-24',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2014-06-04',
      conditionalReleaseDate: '2023-01-24',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
    },
    {
      prisonerNumber: 'A8036DY',
      bookingId: '1201576',
      bookNumber: '38704A',
      firstName: 'JIM',
      lastName: 'MOCKUSER1',
      dateOfBirth: '1992-09-01',
      gender: 'Male',
      youthOffender: false,
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'V',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: '1-3-004',
      aliases: [],
      alerts: [],
      category: 'B',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'ADIMP_ORA20',
      imprisonmentStatusDescription: 'ORA 2020 Standard Determinate Sentence',
      mostSeriousOffence: 'Aid abet counsel and procure common assault',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2021-11-01',
      releaseDate: '2022-12-16',
      sentenceExpiryDate: '2024-01-31',
      licenceExpiryDate: '2024-01-31',
      homeDetentionCurfewEligibilityDate: '2022-08-04',
      nonDtoReleaseDate: '2022-12-16',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2021-11-01',
      conditionalReleaseDate: '2022-12-16',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
    },
    {
      prisonerNumber: 'G0495UG',
      pncNumber: '72/355885B',
      pncNumberCanonicalShort: '72/355885B',
      pncNumberCanonicalLong: '1972/355885B',
      croNumber: '112850/11J',
      bookingId: '805565',
      bookNumber: 'L20360',
      firstName: 'GERALDO',
      middleNames: 'HECTUR',
      lastName: 'POLISHUK',
      dateOfBirth: '1953-11-07',
      gender: 'Male',
      ethnicity: 'White: Eng./Welsh/Scot./N.Irish/British',
      youthOffender: false,
      maritalStatus: 'Male',
      religion: 'Roman Catholic',
      nationality: 'British',
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'INT',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: '7-1-010',
      aliases: [],
      alerts: [
        {
          alertType: 'C',
          alertCode: 'CC1',
          active: true,
          expired: false,
        },
        {
          alertType: 'P',
          alertCode: 'PVN',
          active: true,
          expired: false,
        },
        {
          alertType: 'S',
          alertCode: 'SOR',
          active: true,
          expired: false,
        },
        {
          alertType: 'R',
          alertCode: 'RDBS',
          active: true,
          expired: false,
        },
        {
          alertType: 'P',
          alertCode: 'PL1',
          active: true,
          expired: false,
        },
        {
          alertType: 'P',
          alertCode: 'PC1',
          active: true,
          expired: false,
        },
        {
          alertType: 'R',
          alertCode: 'ROH',
          active: true,
          expired: false,
        },
      ],
      csra: 'Standard',
      category: 'C',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'SENT03',
      imprisonmentStatusDescription: 'Adult Imprisonment Without Option CJA03',
      mostSeriousOffence: 'Rape a girl under 13',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2014-01-06',
      releaseDate: '2022-10-28',
      confirmedReleaseDate: '2022-10-28',
      sentenceExpiryDate: '2031-12-13',
      licenceExpiryDate: '2031-11-26',
      nonDtoReleaseDate: '2022-12-20',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2013-10-30',
      conditionalReleaseDate: '2022-12-20',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
    },
    {
      prisonerNumber: 'G5336UH',
      pncNumber: '16/145644B',
      pncNumberCanonicalShort: '16/145644B',
      pncNumberCanonicalLong: '2016/145644B',
      croNumber: '280428/16R',
      bookingId: '1100560',
      bookNumber: 'W19416',
      firstName: 'CONROY',
      middleNames: 'HUMBOVAN',
      lastName: 'PROUGH',
      dateOfBirth: '1988-02-13',
      gender: 'Male',
      ethnicity: 'White: Eng./Welsh/Scot./N.Irish/British',
      youthOffender: false,
      maritalStatus: 'Single-not married/in civil partnership',
      religion: 'Atheist',
      nationality: 'British',
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'INT',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: '4-1-020',
      aliases: [],
      alerts: [
        {
          alertType: 'T',
          alertCode: 'TAH',
          active: true,
          expired: false,
        },
        {
          alertType: 'S',
          alertCode: 'SSHO',
          active: true,
          expired: false,
        },
        {
          alertType: 'P',
          alertCode: 'PC1',
          active: true,
          expired: false,
        },
        {
          alertType: 'S',
          alertCode: 'SOR',
          active: true,
          expired: false,
        },
      ],
      csra: 'Standard',
      category: 'C',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'LASPO_DR',
      imprisonmentStatusDescription: 'EDS LASPO Discretionary Release',
      mostSeriousOffence: 'Assault a female 13 and over by    penetration with part of body / a thing - SOA 2003',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2016-11-30',
      releaseDate: '2022-11-19',
      confirmedReleaseDate: '2022-11-19',
      sentenceExpiryDate: '2027-12-20',
      licenceExpiryDate: '2027-12-19',
      nonDtoReleaseDate: '2023-01-04',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2016-05-23',
      paroleEligibilityDate: '2020-11-10',
      conditionalReleaseDate: '2023-01-04',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
    },
    {
      prisonerNumber: 'A8589DY',
      bookingId: '1202132',
      bookNumber: '39238A',
      firstName: 'MOCKSUE1',
      lastName: 'MOCKUSER1',
      dateOfBirth: '1970-01-01',
      gender: 'Male',
      youthOffender: false,
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'INT',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: '1-1-006',
      aliases: [],
      alerts: [],
      category: 'D',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'ADIMP_ORA20',
      imprisonmentStatusDescription: 'ORA 2020 Standard Determinate Sentence',
      mostSeriousOffence: 'Drive vehicle for more than 13 hours or more in a working day - domestic',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2022-04-07',
      releaseDate: '2023-04-07',
      sentenceExpiryDate: '2024-04-06',
      licenceExpiryDate: '2024-04-06',
      homeDetentionCurfewEligibilityDate: '2022-11-24',
      nonDtoReleaseDate: '2023-04-07',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2022-04-07',
      conditionalReleaseDate: '2023-04-07',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
    },
    {
      prisonerNumber: 'A8130DY',
      bookingId: '1201663',
      bookNumber: '38791A',
      firstName: 'CVL',
      lastName: 'USER',
      dateOfBirth: '2003-11-20',
      gender: 'Male',
      ethnicity: 'White: Any other background',
      youthOffender: true,
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'TRNCRT',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: '1-3-004',
      aliases: [],
      alerts: [
        {
          alertType: 'O',
          alertCode: 'OHCO',
          active: true,
          expired: false,
        },
      ],
      legalStatus: 'IMMIGRATION_DETAINEE',
      imprisonmentStatus: 'DEPORT',
      imprisonmentStatusDescription: 'Awaiting Deportation Only',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2021-11-29',
      releaseDate: '2023-06-07',
      sentenceExpiryDate: '2024-05-12',
      licenceExpiryDate: '2024-05-12',
      homeDetentionCurfewEligibilityDate: '2023-01-24',
      additionalDaysAwarded: 95,
      nonDtoReleaseDate: '2023-06-07',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2021-11-15',
      conditionalReleaseDate: '2023-06-07',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
    },
    {
      prisonerNumber: 'A8119DY',
      bookingId: '1201655',
      bookNumber: '38783A',
      firstName: 'CRS',
      lastName: 'USER1',
      dateOfBirth: '1985-05-12',
      gender: 'Male',
      ethnicity: 'White: Any other background',
      youthOffender: false,
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'V',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: '1-3-004',
      aliases: [],
      alerts: [],
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'SENT03',
      imprisonmentStatusDescription: 'Adult Imprisonment Without Option CJA03',
      mostSeriousOffence: 'Attempt theft of motor vehicle',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2021-11-23',
      releaseDate: '2022-12-23',
      sentenceExpiryDate: '2024-01-22',
      licenceExpiryDate: '2024-01-22',
      homeDetentionCurfewEligibilityDate: '2022-08-11',
      nonDtoReleaseDate: '2022-12-23',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2021-11-23',
      conditionalReleaseDate: '2022-12-23',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
    },
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
    {
      prisonerNumber: 'A8282DY',
      bookingId: '1201822',
      bookNumber: '38931A',
      firstName: 'VISIT',
      lastName: 'VISIT',
      dateOfBirth: '1970-01-01',
      gender: 'Female',
      youthOffender: false,
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'I',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: 'MCASU-CASU2-C2-004',
      aliases: [],
      alerts: [],
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'ADIMP_ORA20',
      imprisonmentStatusDescription: 'ORA 2020 Standard Determinate Sentence',
      mostSeriousOffence: 'Drive vehicle for more than 13 hours or more in a working day - domestic',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2022-01-21',
      releaseDate: '2023-01-20',
      sentenceExpiryDate: '2024-01-20',
      licenceExpiryDate: '2024-01-20',
      homeDetentionCurfewEligibilityDate: '2022-09-08',
      nonDtoReleaseDate: '2023-01-20',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2022-01-21',
      conditionalReleaseDate: '2023-01-20',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
    },
    {
      prisonerNumber: 'G3607UQ',
      pncNumber: '03/114924M',
      pncNumberCanonicalShort: '03/114924M',
      pncNumberCanonicalLong: '2003/114924M',
      croNumber: '180563/03H',
      bookingId: '1053811',
      bookNumber: 'V37690',
      firstName: 'BEAUREGARD',
      lastName: 'YABUT',
      dateOfBirth: '1977-04-30',
      gender: 'Male',
      ethnicity: 'Other: Any other background',
      youthOffender: false,
      maritalStatus: 'Single-not married/in civil partnership',
      religion: 'Religion - Muslim',
      nationality: 'Iraqi',
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'INT',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: '2-2-028',
      aliases: [
        {
          firstName: 'UKAEEMARIE',
          lastName: 'FABERON',
          dateOfBirth: '1977-04-03',
          gender: 'Male',
          ethnicity: "Asian/Asian British: Any other backgr'nd",
        },
        {
          firstName: 'YMYNNEUMAR',
          lastName: 'CARRER',
          dateOfBirth: '1968-01-14',
          gender: 'Male',
        },
        {
          firstName: 'YMYNNEUMAR',
          middleNames: 'SPENCEL',
          lastName: 'IRERON',
          dateOfBirth: '1976-04-03',
          gender: 'Male',
        },
        {
          firstName: 'YMYNNEUMAR',
          middleNames: 'DANTISTA',
          lastName: 'ALFEW',
          dateOfBirth: '1976-03-25',
          gender: 'Male',
        },
      ],
      alerts: [
        {
          alertType: 'X',
          alertCode: 'XNR',
          active: true,
          expired: false,
        },
        {
          alertType: 'R',
          alertCode: 'RSS',
          active: true,
          expired: false,
        },
        {
          alertType: 'X',
          alertCode: 'XA',
          active: true,
          expired: false,
        },
        {
          alertType: 'X',
          alertCode: 'XILLENT',
          active: true,
          expired: false,
        },
        {
          alertType: 'X',
          alertCode: 'XVL',
          active: true,
          expired: false,
        },
      ],
      csra: 'High',
      category: 'C',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'SENT03',
      imprisonmentStatusDescription: 'Adult Imprisonment Without Option CJA03',
      mostSeriousOffence: 'Arson with intent / reckless as to whether life was endangered',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2016-09-02',
      releaseDate: '2025-05-21',
      confirmedReleaseDate: '2025-05-21',
      sentenceExpiryDate: '2018-09-29',
      licenceExpiryDate: '2018-09-10',
      homeDetentionCurfewEligibilityDate: '2016-12-30',
      additionalDaysAwarded: 7,
      nonDtoReleaseDate: '2023-05-03',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2015-12-14',
      conditionalReleaseDate: '2023-05-03',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
    },
    {
      prisonerNumber: 'G3721GG',
      pncNumber: '01/6023L',
      pncNumberCanonicalShort: '01/6023L',
      pncNumberCanonicalLong: '2001/6023L',
      croNumber: '191467/01X',
      bookingId: '1029376',
      bookNumber: 'R94271',
      firstName: 'IENCENNE',
      middleNames: 'ESMAB',
      lastName: 'TRASINA',
      dateOfBirth: '1987-08-08',
      gender: 'Male',
      ethnicity: 'White : Irish',
      youthOffender: false,
      maritalStatus: 'Male',
      religion: 'Church of England (Anglican)',
      nationality: 'British',
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'CRT',
      lastMovementReasonCode: 'PR',
      inOutStatus: 'IN',
      prisonId: 'LEI',
      prisonName: 'Leeds (HMP)',
      cellLocation: 'E-3-025',
      aliases: [],
      alerts: [],
      csra: 'Standard',
      category: 'B',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'SENT03',
      imprisonmentStatusDescription: 'Adult Imprisonment Without Option CJA03',
      mostSeriousOffence: 'Conspire to commit robbery',
      recall: true,
      indeterminateSentence: false,
      sentenceStartDate: '2013-05-23',
      releaseDate: '2023-09-15',
      confirmedReleaseDate: '2023-09-15',
      sentenceExpiryDate: '2030-05-31',
      licenceExpiryDate: '2030-05-31',
      nonDtoReleaseDate: '2023-10-31',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2015-09-25',
      conditionalReleaseDate: '2023-10-31',
      locationDescription: 'Leeds (HMP)',
      restrictedPatient: false,
      currentIncentive: {
        level: {
          code: 'STD',
          description: 'Standard',
        },
        dateTime: '2017-02-16T10:10:05',
        nextReviewDate: '2018-02-16',
      },
    },
    {
      prisonerNumber: 'G3805GO',
      pncNumber: '90/189289T',
      pncNumberCanonicalShort: '90/189289T',
      pncNumberCanonicalLong: '1990/189289T',
      croNumber: '189289/90K',
      bookingId: '1088306',
      bookNumber: 'K93523',
      firstName: 'YNCESHEL',
      middleNames: 'REBECCA',
      lastName: 'NOLIVE',
      dateOfBirth: '1979-01-08',
      gender: 'Male',
      ethnicity: 'White: Eng./Welsh/Scot./N.Irish/British',
      youthOffender: false,
      maritalStatus: 'Single-not married/in civil partnership',
      religion: 'No Religion',
      nationality: 'British',
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'TRNCRT',
      inOutStatus: 'IN',
      prisonId: 'LEI',
      prisonName: 'Leeds (HMP)',
      cellLocation: 'A-3-032',
      aliases: [],
      alerts: [],
      csra: 'High',
      category: 'B',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'LASPO_DR',
      imprisonmentStatusDescription: 'EDS LASPO Discretionary Release',
      mostSeriousOffence: 'Robbery',
      recall: true,
      indeterminateSentence: false,
      sentenceStartDate: '2013-12-01',
      releaseDate: '2024-05-18',
      confirmedReleaseDate: '2024-05-18',
      sentenceExpiryDate: '2026-07-01',
      licenceExpiryDate: '2026-07-02',
      nonDtoReleaseDate: '2024-06-26',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2016-04-12',
      paroleEligibilityDate: '2021-11-16',
      conditionalReleaseDate: '2024-06-26',
      locationDescription: 'Leeds (HMP)',
      restrictedPatient: false,
      currentIncentive: {
        level: {
          code: 'ENH',
          description: 'Enhanced',
        },
        dateTime: '2016-09-08T14:33:19',
        nextReviewDate: '2017-09-08',
      },
    },
    {
      prisonerNumber: 'G4130UP',
      pncNumber: '73/36268G',
      pncNumberCanonicalShort: '73/36268G',
      pncNumberCanonicalLong: '1973/36268G',
      croNumber: '36268/73X',
      bookingId: '1181157',
      bookNumber: '31970A',
      firstName: 'EMUTON',
      lastName: 'NORMIAN',
      dateOfBirth: '1952-12-07',
      gender: 'Male',
      ethnicity: 'Asian/Asian British: Pakistani',
      youthOffender: false,
      maritalStatus: 'Male',
      religion: 'Religion - Muslim',
      nationality: 'British',
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'I',
      inOutStatus: 'IN',
      prisonId: 'LEI',
      prisonName: 'Leeds (HMP)',
      cellLocation: 'F-3-009',
      aliases: [],
      alerts: [],
      csra: 'Standard',
      category: 'B',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'SENT03',
      imprisonmentStatusDescription: 'Adult Imprisonment Without Option CJA03',
      mostSeriousOffence: 'Rape a girl aged 13 / 14 / 15 - SOA 2003',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2017-04-15',
      releaseDate: '2023-09-05',
      confirmedReleaseDate: '2023-09-05',
      sentenceExpiryDate: '2030-04-07',
      licenceExpiryDate: '2030-04-21',
      nonDtoReleaseDate: '2023-10-01',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2017-03-07',
      conditionalReleaseDate: '2023-10-01',
      locationDescription: 'Leeds (HMP)',
      restrictedPatient: false,
      currentIncentive: {
        level: {
          code: 'STD',
          description: 'Standard',
        },
        dateTime: '2017-03-23T11:25:27',
        nextReviewDate: '2018-03-23',
      },
    },
    {
      prisonerNumber: 'G4478UF',
      pncNumber: '01/459980T',
      pncNumberCanonicalShort: '01/459980T',
      pncNumberCanonicalLong: '2001/459980T',
      croNumber: '347932/01T',
      bookingId: '972354',
      bookNumber: 'P96281',
      firstName: 'OUHIAOPHE',
      lastName: 'RAMAEL',
      dateOfBirth: '1984-03-11',
      gender: 'Male',
      ethnicity: 'Asian/Asian British: Pakistani',
      youthOffender: false,
      maritalStatus: 'Single-not married/in civil partnership',
      religion: 'Religion - Muslim',
      nationality: 'British',
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'INT',
      inOutStatus: 'IN',
      prisonId: 'LEI',
      prisonName: 'Leeds (HMP)',
      cellLocation: 'C-4-041',
      aliases: [],
      alerts: [],
      csra: 'Standard',
      category: 'B',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'SENT03',
      imprisonmentStatusDescription: 'Adult Imprisonment Without Option CJA03',
      mostSeriousOffence: 'Conspire to supply a class A controlled drug - heroin',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2016-07-22',
      releaseDate: '2024-07-24',
      confirmedReleaseDate: '2024-07-24',
      sentenceExpiryDate: '2033-08-29',
      licenceExpiryDate: '2033-07-29',
      additionalDaysAwarded: 18,
      nonDtoReleaseDate: '2024-08-23',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2015-03-27',
      conditionalReleaseDate: '2024-08-23',
      locationDescription: 'Leeds (HMP)',
      restrictedPatient: false,
      currentIncentive: {
        level: {
          code: 'ENH',
          description: 'Enhanced',
        },
        dateTime: '2017-03-24T12:52:55',
        nextReviewDate: '2018-03-24',
      },
    },
    {
      prisonerNumber: 'G9930UP',
      pncNumber: '73/36268G',
      pncNumberCanonicalShort: '73/36268G',
      pncNumberCanonicalLong: '1973/36268G',
      croNumber: '36268/73X',
      bookingId: '1181157',
      bookNumber: '31970A',
      firstName: 'EMUTON',
      lastName: 'NORMIAN',
      dateOfBirth: '1952-12-07',
      gender: 'Male',
      ethnicity: 'Asian/Asian British: Pakistani',
      youthOffender: false,
      maritalStatus: 'Male',
      religion: 'Religion - Muslim',
      nationality: 'British',
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'I',
      inOutStatus: 'IN',
      prisonId: 'LEI',
      prisonName: 'Leeds (HMP)',
      cellLocation: 'F-3-009',
      aliases: [],
      alerts: [],
      csra: 'Standard',
      category: 'B',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'SENT03',
      imprisonmentStatusDescription: 'Adult Imprisonment Without Option CJA03',
      mostSeriousOffence: 'Rape a girl aged 13 / 14 / 15 - SOA 2003',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2017-04-15',
      releaseDate: '2023-09-05',
      confirmedReleaseDate: '2023-09-05',
      sentenceExpiryDate: '2030-04-07',
      licenceExpiryDate: '2030-04-21',
      nonDtoReleaseDate: '2023-10-01',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2017-03-07',
      conditionalReleaseDate: '2023-10-01',
      locationDescription: 'Leeds (HMP)',
      restrictedPatient: false,
      currentIncentive: {
        level: {
          code: 'STD',
          description: 'Standard',
        },
        dateTime: '2017-03-23T11:25:27',
        nextReviewDate: '2018-03-23',
      },
    },
    {
      prisonerNumber: 'G9978UF',
      pncNumber: '01/459980T',
      pncNumberCanonicalShort: '01/459980T',
      pncNumberCanonicalLong: '2001/459980T',
      croNumber: '347932/01T',
      bookingId: '972354',
      bookNumber: 'P96281',
      firstName: 'OUHIAOPHE',
      lastName: 'RAMAEL',
      dateOfBirth: '1984-03-11',
      gender: 'Male',
      ethnicity: 'Asian/Asian British: Pakistani',
      youthOffender: false,
      maritalStatus: 'Single-not married/in civil partnership',
      religion: 'Religion - Muslim',
      nationality: 'British',
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'INT',
      inOutStatus: 'IN',
      prisonId: 'LEI',
      prisonName: 'Leeds (HMP)',
      cellLocation: 'C-4-041',
      aliases: [],
      alerts: [],
      csra: 'Standard',
      category: 'B',
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'SENT03',
      imprisonmentStatusDescription: 'Adult Imprisonment Without Option CJA03',
      mostSeriousOffence: 'Conspire to supply a class A controlled drug - heroin',
      recall: false,
      indeterminateSentence: false,
      sentenceStartDate: '2016-07-22',
      releaseDate: '2024-07-24',
      confirmedReleaseDate: '2024-07-24',
      sentenceExpiryDate: '2033-08-29',
      licenceExpiryDate: '2033-07-29',
      additionalDaysAwarded: 18,
      nonDtoReleaseDate: '2024-08-23',
      nonDtoReleaseDateType: 'CRD',
      receptionDate: '2015-03-27',
      conditionalReleaseDate: '2024-08-23',
      locationDescription: 'Leeds (HMP)',
      restrictedPatient: false,
      currentIncentive: {
        level: {
          code: 'ENH',
          description: 'Enhanced',
        },
        dateTime: '2017-03-24T12:52:55',
        nextReviewDate: '2018-03-24',
      },
    },
  ],
}

const stubCohortListSortedByLastName = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/prisoner-search/release-date-by-prison?order=ascending&page=0&size=2000',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        ...getTestSortedCohortData,
      },
    },
  })

export default { stubCohortListSortedByLastName }
