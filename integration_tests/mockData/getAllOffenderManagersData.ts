const data = [
  {
    staffCode: 'N07P003',
    staffId: 485588,
    isResponsibleOfficer: false,
    isPrisonOffenderManager: false,
    isUnallocated: false,
    staff: {
      forenames: 'Chloe ZZ',
      surname: 'Ransom',
    },
    team: {
      code: 'N07T01',
      description: 'OMU A',
      localDeliveryUnit: {
        code: 'N07NPSA',
        description: 'N07 Division',
      },
      teamType: {
        code: 'N07NPS1',
        description: 'N07 LDU 1',
      },
      district: {
        code: 'N07NPSA',
        description: 'N07 Division',
      },
      borough: {
        code: 'N07100',
        description: 'N07 Cluster 1',
      },
      startDate: '2014-08-29',
    },
    probationArea: {
      probationAreaId: 1500001006,
      code: 'N07',
      description: 'NPS London',
      organisation: {
        code: 'NPS',
        description: 'National Probation Service',
      },
      teams: [
        {
          teamId: 2500013360,
          code: 'N07DTX',
          description: 'Default Designated Transfer Team',
          isPrivate: false,
          scProvider: {
            code: 'N07DTX',
            description: 'Default Designated Transfer Team',
          },
          localDeliveryUnit: {
            code: 'N07UAT',
            description: 'Unallocated LDU(N07)',
          },
          district: {
            code: 'N07UAT',
            description: 'Unallocated Level 3(N07)',
          },
          borough: {
            code: 'N07UAT',
            description: 'Unallocated Level 2(N07)',
          },
        },
        {
          teamId: 2500013881,
          code: 'N07PRC',
          description: 'CRC Created',
          isPrivate: false,
          scProvider: {
            code: 'N07PRC',
            description: 'CRC Created',
          },
          localDeliveryUnit: {
            code: 'N07UAT',
            description: 'Unallocated LDU(N07)',
          },
          district: {
            code: 'N07UAT',
            description: 'Unallocated Level 3(N07)',
          },
          borough: {
            code: 'N07UAT',
            description: 'Unallocated Level 2(N07)',
          },
        },
        {
          teamId: 1500119967,
          code: 'N07UAT',
          description: 'Unallocated Team(N07)',
          isPrivate: false,
          scProvider: {
            code: 'N07UAT',
            description: 'Unallocated Team(N07)',
          },
          localDeliveryUnit: {
            code: 'N07NPS1',
            description: 'N07 LDU 1',
          },
          district: {
            code: 'N07NPSA',
            description: 'N07 Division',
          },
          borough: {
            code: 'N07100',
            description: 'N07 Cluster 1',
          },
        },
        {
          teamId: 2500002006,
          code: 'N07T01',
          description: 'OMU A',
          isPrivate: false,
          scProvider: {
            code: 'N07T01',
            description: 'OMU A',
          },
          localDeliveryUnit: {
            code: 'N07NPS1',
            description: 'N07 LDU 1',
          },
          district: {
            code: 'N07NPSA',
            description: 'N07 Division',
          },
          borough: {
            code: 'N07100',
            description: 'N07 Cluster 1',
          },
        },
        {
          teamId: 2500002013,
          code: 'N07T02',
          description: 'OMU B',
          isPrivate: false,
          scProvider: {
            code: 'N07T02',
            description: 'OMU B',
          },
          localDeliveryUnit: {
            code: 'N07NPS1',
            description: 'N07 LDU 1',
          },
          district: {
            code: 'N07NPSA',
            description: 'N07 Division',
          },
          borough: {
            code: 'N07100',
            description: 'N07 Cluster 1',
          },
        },
        {
          teamId: 2500002020,
          code: 'N07T03',
          description: 'OMU C',
          isPrivate: false,
          scProvider: {
            code: 'N07T03',
            description: 'OMU C',
          },
          localDeliveryUnit: {
            code: 'N07NPS1',
            description: 'N07 LDU 1',
          },
          district: {
            code: 'N07NPSA',
            description: 'N07 Division',
          },
          borough: {
            code: 'N07100',
            description: 'N07 Cluster 1',
          },
        },
        {
          teamId: 2500002027,
          code: 'N07T04',
          description: 'OMU D',
          isPrivate: false,
          scProvider: {
            code: 'N07T04',
            description: 'OMU D',
          },
          localDeliveryUnit: {
            code: 'N07NPS1',
            description: 'N07 LDU 1',
          },
          district: {
            code: 'N07NPSA',
            description: 'N07 Division',
          },
          borough: {
            code: 'N07100',
            description: 'N07 Cluster 1',
          },
        },
        {
          teamId: 2500002118,
          code: 'N07T05',
          description: 'Diary Team',
          isPrivate: false,
          scProvider: {
            code: 'N07T05',
            description: 'Diary Team',
          },
          localDeliveryUnit: {
            code: 'N07NPS1',
            description: 'N07 LDU 1',
          },
          district: {
            code: 'N07NPSA',
            description: 'N07 Division',
          },
          borough: {
            code: 'N07100',
            description: 'N07 Cluster 1',
          },
        },
        {
          teamId: 2500002188,
          code: 'N07IAV',
          description: 'Inactive',
          isPrivate: false,
          scProvider: {
            code: 'N07IAV',
            description: 'Inactive',
          },
          localDeliveryUnit: {
            code: 'N07NPS1',
            description: 'N07 LDU 1',
          },
          district: {
            code: 'N07NPSA',
            description: 'N07 Division',
          },
          borough: {
            code: 'N07100',
            description: 'N07 Cluster 1',
          },
        },
        {
          teamId: 2500002195,
          code: 'N07000',
          description: 'Transfer Team',
          isPrivate: false,
          scProvider: {
            code: 'N07000',
            description: 'Transfer Team',
          },
          localDeliveryUnit: {
            code: 'N07NPS1',
            description: 'N07 LDU 1',
          },
          district: {
            code: 'N07NPSA',
            description: 'N07 Division',
          },
          borough: {
            code: 'N07100',
            description: 'N07 Cluster 1',
          },
        },
        {
          teamId: 2500028272,
          code: 'N07UTS',
          description: 'Tiering Service',
          isPrivate: false,
          scProvider: {
            code: 'N07UTS',
            description: 'Tiering Service',
          },
          localDeliveryUnit: {
            code: 'N07NPS1',
            description: 'N07 LDU 1',
          },
          district: {
            code: 'N07NPSA',
            description: 'N07 Division',
          },
          borough: {
            code: 'N07100',
            description: 'N07 Cluster 1',
          },
        },
      ],
    },
    fromDate: '2015-05-27',
    grade: {
      code: 'NPSM',
      description: 'NPS - PO',
    },
  },
]

export default data
