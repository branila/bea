import { Roles, type User } from '$types/db'

// Checks if a user has at least one of the roles passed as arguments
export default function hasRole(user: User, ...roles: Roles[]): boolean {
  return roles.some(role => {
    return user!.roles.includes(role)
  })
}
