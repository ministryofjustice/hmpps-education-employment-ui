export default {
  workProfile: (id: string) => `/work-profile/${id}`,
  createProfile: {
    checkAnswers: (id: string) => `/work-profile/create/${id}/check-answers`,
    ineligableToWork: (id: string, mode: string) => `/work-profile/create/${id}/ineligable-to-work/${mode}`,
    rightToWork: (id: string, mode: string) => `/work-profile/create/${id}/right-to-work/${mode}`,
    supportOptIn: (id: string, mode: string) => `/work-profile/create/${id}/support-opt-in/${mode}`,
    alreadyInPlace: (id: string, mode: string) => `/work-profile/create/${id}/already-in-place/${mode}`,
    supportDeclinedReason: (id: string, mode: string) => `/work-profile/create/${id}/support-declined-reason/${mode}`,
    whatNeedsToChange: (id: string, mode: string) => `/work-profile/create/${id}/what-needs-to-change/${mode}`,
  },
}
