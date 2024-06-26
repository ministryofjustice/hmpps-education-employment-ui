export default {
  cohortList: () => '/',
  workProfile: (id: string, tab = 'overview') => `/profile/${id}/view/${tab}`,
  createProfile: {
    checkAnswers: (id: string) => `/profile/create/${id}/check-answers`,
    ineligableToWork: (id: string, mode = 'new') => `/profile/create/${id}/ineligable-to-work/${mode}`,
    rightToWork: (id: string, mode = 'new') => `/profile/create/${id}/right-to-work/${mode}`,
    supportOptIn: (id: string, mode = 'new') => `/profile/create/${id}/support-opt-in/${mode}`,
    alreadyInPlace: (id: string, mode = 'new') => `/profile/create/${id}/already-in-place/${mode}`,
    identification: (id: string, mode = 'new') => `/profile/create/${id}/identification/${mode}`,
    abilityToWork: (id: string, mode = 'new') => `/profile/create/${id}/ability-to-work/${mode}`,
    manageDrugsAndAlcohol: (id: string, mode = 'new') => `/profile/create/${id}/manage-drugs-and-alcohol/${mode}`,
    typeOfWork: (id: string, mode = 'new') => `/profile/create/${id}/type-of-work/${mode}`,
    supportDeclinedReason: (id: string, mode = 'new') => `/profile/create/${id}/support-declined-reason/${mode}`,
    whatNeedsToChange: (id: string, mode = 'new') => `/profile/create/${id}/what-needs-to-change/${mode}`,
    jobOfParticularInterest: (id: string, mode = 'new') => `/profile/create/${id}/job-of-particular-interest/${mode}`,
    workExperience: (id: string, mode = 'new') => `/profile/create/${id}/work-experience/${mode}`,
    trainingAndQualifications: (id: string, mode = 'new') =>
      `/profile/create/${id}/training-and-qualifications/${mode}`,
  },
  changeStatus: {
    newStatus: (id: string) => `/profile/change-status/${id}/new-status`,
    newStatusPause: (id: string) => `/profile/change-status/${id}/pause`,
  },
  actions: {
    editAction: (id: string, action: string) => `/profile/actions/${id}/edit/${action.toLowerCase()}`,
  },
}
