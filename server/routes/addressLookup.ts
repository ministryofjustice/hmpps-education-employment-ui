export default {
  homePage: () => '/',
  workProfile: (id: string, tab: string, module = 'wr') => `/${module}/profile/${id}/view/${tab}`,
  workReadiness: {
    cohortList: () => '/wr/cohort-list',
    createProfile: {
      checkAnswers: (id: string) => `/wr/profile/create/${id}/check-answers`,
      ineligableToWork: (id: string, mode = 'new') => `/wr/profile/create/${id}/ineligable-to-work/${mode}`,
      rightToWork: (id: string, mode = 'new') => `/wr/profile/create/${id}/right-to-work/${mode}`,
      supportOptIn: (id: string, mode = 'new') => `/wr/profile/create/${id}/support-opt-in/${mode}`,
      alreadyInPlace: (id: string, mode = 'new') => `/wr/profile/create/${id}/already-in-place/${mode}`,
      identification: (id: string, mode = 'new') => `/wr/profile/create/${id}/identification/${mode}`,
      abilityToWork: (id: string, mode = 'new') => `/wr/profile/create/${id}/ability-to-work/${mode}`,
      manageDrugsAndAlcohol: (id: string, mode = 'new') => `/wr/profile/create/${id}/manage-drugs-and-alcohol/${mode}`,
      typeOfWork: (id: string, mode = 'new') => `/wr/profile/create/${id}/type-of-work/${mode}`,
      supportDeclinedReason: (id: string, mode = 'new') => `/wr/profile/create/${id}/support-declined-reason/${mode}`,
      whatNeedsToChange: (id: string, mode = 'new') => `/wr/profile/create/${id}/what-needs-to-change/${mode}`,
      jobOfParticularInterest: (id: string, mode = 'new') =>
        `/wr/profile/create/${id}/job-of-particular-interest/${mode}`,
      workExperience: (id: string, mode = 'new') => `/wr/profile/create/${id}/work-experience/${mode}`,
      trainingAndQualifications: (id: string, mode = 'new') =>
        `/wr/profile/create/${id}/training-and-qualifications/${mode}`,
    },
    changeStatus: {
      newStatus: (id: string) => `/wr/profile/change-status/${id}/new-status`,
      newStatusPause: (id: string) => `/wr/profile/change-status/${id}/pause`,
    },
    actions: {
      editAction: (id: string, action: string) => `/wr/profile/actions/${id}/edit/${action.toLowerCase()}`,
    },
  },
  candidateMatching: {
    prisonerListMatchJobs: () => '/mjma/prisoners',
    prisonerListApplications: () => '/mjma/applications',
    archivedJobs: (id: string) => `/mjma/${id}/jobs/archived`,
    jobsOfInterest: (id: string) => `/mjma/${id}/jobs/interested`,
    matchedJobs: (id: string) => `/mjma/${id}/jobs/matched`,
    nationalJobs: (id: string) => `/mjma/${id}/jobs/national-jobs`,
    jobDetails: (id: string, jobId: string) => `/mjma/${id}/job/${jobId}/details`,
    manageApplication: (id: string, jobId: string, mode = 'view') => `/mjma/${id}/job/${jobId}/application/${mode}`,
  },
}
