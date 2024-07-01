const hasAnyRole = (requiredRoles: string[], userRoles: string[]): boolean =>
  requiredRoles.some(role => userRoles.includes(role))

export default hasAnyRole
