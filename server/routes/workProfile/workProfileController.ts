import _ from 'lodash'
import { plainToClass } from 'class-transformer'
import { RequestHandler } from 'express'

import { getAge } from '../../utils/utils'
import NeurodivergenceViewModel from '../../viewModels/neurodivergenceViewModel'
import LearnerEducationViewModel from '../../viewModels/learnerEducationViewModel'
import PrisonerViewModel from '../../viewModels/prisonerViewModel'
import ProfileViewModel from '../../viewModels/profileViewModel'
import AssessmentViewModel from '../../viewModels/assessmentViewModel'
import EmployabilitySkillViewModel from '../../viewModels/employabilitySkillViewModel'
import KeyworkerViewModel from '../../viewModels/keyworkerViewModel'
import ActivityViewModel from '../../viewModels/activityViewModel'

export default class WorkProfileController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { id, tab } = req.params
    const {
      prisoner,
      profile,
      employabilitySkills,
      learnerLatestAssessment,
      neurodivergence,
      learnerEducation,
      keyworker,
      currentOffenderActivities,
      unacceptableAbsencesCount,
    } = req.context

    try {
      const data = {
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
        contacts: {
          keyworker: plainToClass(KeyworkerViewModel, keyworker),
        },
        currentActivities: plainToClass(ActivityViewModel, currentOffenderActivities),
        unacceptableAbsencesCount,
        tab,
      }

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
