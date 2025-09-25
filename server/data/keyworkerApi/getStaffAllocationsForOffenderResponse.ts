interface GetStaffAllocationsForOffenderResponse {
  allocations: Allocation[]
}

interface Allocation {
  policy: Policy
  staffMember: StaffMember
}

interface Policy {
  code: string
  description: string
}

interface StaffMember {
  staffId: number
  firstName: string
  lastName: string
  emailAddresses: string[]
}

export default GetStaffAllocationsForOffenderResponse
