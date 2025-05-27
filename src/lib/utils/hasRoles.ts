import {type Role, type User } from "$types"

// Checks if a user has at least one of the roles passed as arguments
export default function hasRoles(user: User, ...roles: Role[]): boolean {
  return roles.some(role => {
    return user.roles.includes(role)
  })
}
