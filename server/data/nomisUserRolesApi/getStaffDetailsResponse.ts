export default interface GetStaffDetailsResonse {
  staffId: number
  firstName: string
  lastName: string
  status: string
  primaryEmail?: string
  generalAccount: {
    username: string
    active: boolean
    accountType: string
    activeCaseload: {
      id: string
      name: string
    }
    caseloads: { id: string; name: string }[]
  }
}
