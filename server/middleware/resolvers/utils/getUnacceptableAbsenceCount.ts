import ActivitiesService from '../../../services/activitiesService'

const getUnacceptibleAbsenceCount = async (activitiesService: ActivitiesService, username: string, id: string) => {
  const fromDate = new Date()
  fromDate.setMonth(fromDate.getMonth() - 6)
  const toDate = new Date()

  return activitiesService.getUnacceptibleAbsenceCount(username, id, fromDate, toDate)
}

export default getUnacceptibleAbsenceCount
