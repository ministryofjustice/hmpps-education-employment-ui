export default {
  workProfile: (id: string, tab = 'overview') => `/work-profile/${id}/view/${tab}`,
  createProfile: {
    checkAnswers: (id: string) => `/work-profile/create/${id}/check-answers`,
    ineligableToWork: (id: string, mode = 'new') => `/work-profile/create/${id}/ineligable-to-work/${mode}`,
    rightToWork: (id: string, mode = 'new') => `/work-profile/create/${id}/right-to-work/${mode}`,
    supportOptIn: (id: string, mode = 'new') => `/work-profile/create/${id}/support-opt-in/${mode}`,
    alreadyInPlace: (id: string, mode = 'new') => `/work-profile/create/${id}/already-in-place/${mode}`,
    identification: (id: string, mode = 'new') => `/work-profile/create/${id}/identification/${mode}`,
    abilityToWork: (id: string, mode = 'new') => `/work-profile/create/${id}/ability-to-work/${mode}`,
    manageDrugsAndAlcohol: (id: string, mode = 'new') => `/work-profile/create/${id}/manage-drugs-and-alcohol/${mode}`,
    typeOfWork: (id: string, mode = 'new') => `/work-profile/create/${id}/type-of-work/${mode}`,
    supportDeclinedReason: (id: string, mode = 'new') => `/work-profile/create/${id}/support-declined-reason/${mode}`,
    whatNeedsToChange: (id: string, mode = 'new') => `/work-profile/create/${id}/what-needs-to-change/${mode}`,
    jobOfParticularInterest: (id: string, mode = 'new') =>
      `/work-profile/create/${id}/job-of-particular-interest/${mode}`,
    workExperience: (id: string, mode = 'new') => `/work-profile/create/${id}/work-experience/${mode}`,
    trainingAndQualifications: (id: string, mode = 'new') =>
      `/work-profile/create/${id}/training-and-qualifications/${mode}`,
  },
}
