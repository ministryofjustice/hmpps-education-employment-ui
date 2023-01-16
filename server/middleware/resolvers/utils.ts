/* eslint-disable import/prefer-default-export */
import type { Request } from 'express'

import { UserService } from '../../services'
import { getSessionData, setSessionData } from '../../utils/session'

export const getUserFullName = async (req: Request, userService: UserService, token: string, userName: string) => {
  try {
    let name = getSessionData(req, ['userNameCache', userName], '')
    if (!name) {
      const found = await userService.getUserByUsername(token, userName)
      name = found.name
      setSessionData(req, ['userNameCache', userName], found.name)
    }

    return name || userName
  } catch (err) {
    // handle no user account
    if (err?.data?.field === 'username') {
      return userName
    }

    throw err
  }
}
