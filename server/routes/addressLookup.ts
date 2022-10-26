export default {
  workProfile: (id: string) => `/work-profile/${id}`,
  createProfile: {
    checkAnswers: (id: string) => `/work-profile/create/${id}/check-answers`,
    ineligableToWork: (id: string) => `/work-profile/create/${id}/ineligable-to-work`,
    rightToWork: (id: string, mode: string) => `/work-profile/create/${id}/right-to-work/${mode}`,
    supportOptIn: (id: string, mode: string) => `/work-profile/create/${id}/support-opt-in/${mode}`,
  },
}
