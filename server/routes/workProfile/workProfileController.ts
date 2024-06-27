import _ from 'lodash'
import { plainToClass } from 'class-transformer'
import { RequestHandler } from 'express'

import { getAge } from '../../utils/index'
import NeurodivergenceViewModel from '../../viewModels/neurodivergenceViewModel'
import LearnerEducationViewModel from '../../viewModels/learnerEducationViewModel'
import PrisonerViewModel from '../../viewModels/prisonerViewModel'
import ProfileViewModel from '../../viewModels/profileViewModel'
import AssessmentViewModel from '../../viewModels/assessmentViewModel'
import EmployabilitySkillViewModel from '../../viewModels/employabilitySkillViewModel'
import ActivityViewModel from '../../viewModels/activityViewModel'
import { deleteSessionData, setSessionData } from '../../utils/session'
import JobViewModel from '../../viewModels/jobViewModel'

export default class WorkProfileController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { module, id, tab } = req.params
    const {
      prisoner,
      profile,
      employabilitySkills,
      learnerLatestAssessment,
      neurodivergence,
      learnerEducation,
      keyworker,
      currentOffenderActivities,
      unacceptableAbsenceCount,
      pom,
      com,
      matchedJobsResults,
      jobsOfInterest,
      openApplications = [],
      closedApplications = [],
      prisonerAddress = {},
    } = req.context

    try {
      deleteSessionData(req, ['editAction', id, 'cachedValues'])

      const data = {
        module,
        tab,
        id,
        prisoner: {
          ...plainToClass(PrisonerViewModel, prisoner),
          age: getAge(prisoner.dateOfBirth),
        },
        profile: plainToClass(ProfileViewModel, profile),
        employabilitySkills: plainToClass(
          EmployabilitySkillViewModel,
          getOnlyLatest(_.get(employabilitySkills, 'content', [])),
        ),
        learnerLatestAssessment: plainToClass(AssessmentViewModel, _.first(learnerLatestAssessment)),
        neurodivergence: plainToClass(NeurodivergenceViewModel, _.first(neurodivergence)),
        learnerEducation: plainToClass(LearnerEducationViewModel, _.get(learnerEducation, 'content', [])),
        currentActivities: plainToClass(ActivityViewModel, currentOffenderActivities),
        contacts: {
          keyworker,
          pom,
          com,
        },
        unacceptableAbsenceCount,
        matchedJobs: plainToClass(JobViewModel, matchedJobsResults || []),
        jobsOfInterest: plainToClass(JobViewModel, jobsOfInterest || []),
        openApplications,
        closedApplications,
        releaseArea: prisonerAddress,
      }

      setSessionData(req, ['workProfile', id, 'currentModule'], module)

      res.render('pages/workProfile/index', { ...data })
    } catch (err) {
      next(err)
    }
  }
}

interface Skill {
  employabilitySkill: string
  activityEndDate: string
}

const getOnlyLatest = (skills: Skill[] = []) => {
  const returnList: Skill[] = []
  const sortedList = _.orderBy(skills, ['activityEndDate'], ['desc'])

  sortedList.forEach(skill => {
    if (!returnList.find(a => a.employabilitySkill === skill.employabilitySkill)) {
      returnList.push({ ...skill })
    }
  })

  return returnList
}
