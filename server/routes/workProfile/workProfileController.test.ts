import { auditService } from '@ministryofjustice/hmpps-audit-client'
import expressMocks from '../../testutils/expressMocks'
import config from '../../config'
import WorkProfileController from './workProfileController'

describe('WorkProfileController', () => {
  const { req, res, next } = expressMocks()

  const controller = new WorkProfileController()

  req.context.prisoner = {
    prisonerNumber: 'mock_prisonerNumber',
    firstName: 'mock_firstName',
    lastName: 'mock_lastName',
    dateOfBirth: 'mock_dateOfBirth',
  }

  res.locals.user = { username: 'mock_user' }

  describe('#get(req, res)', () => {
    const auditSpy = jest.spyOn(auditService, 'sendAuditMessage')

    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()

      config.apis.hmppsAudit.enabled = true
      auditSpy.mockReset()
      auditSpy.mockResolvedValue()
    })

    it('On success - audits prisoner view', async () => {
      await controller.get(req, res, next)

      expect(auditSpy).toHaveBeenCalledWith({
        action: 'VIEW_PRISONER',
        who: res.locals.user.username,
        subjectId: req.context.prisoner.prisonerNumber,
        subjectType: 'PRISONER_ID',
        service: config.apis.hmppsAudit.auditServiceName,
      })
    })
  })
})
